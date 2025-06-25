import { JwtRepository } from '@app/core/domain/auth/jwt.repository';
import {
    DigitalPassportMetadata,
    PassportAttribute,
} from '@app/core/domain/passport/digital-passport-metadata';
import { GooglePassObject } from '@app/core/domain/passport/google-wallet-types';
import { PassportMetadataRepository } from '@app/core/domain/passport/passport-metadata.repository';
import {
    DeviceInfo,
    WalletPassData,
    WalletPassRepository,
} from '@app/core/domain/passport/wallet-pass.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppleWalletRepositoryApi } from './apple-wallet.repository-api';
import { GoogleWalletRepositoryApi } from './google-wallet.repository-api';

@Injectable()
export class WalletPassRepositoryImpl implements WalletPassRepository {
    private readonly logger = new Logger(WalletPassRepositoryImpl.name);
    private readonly walletPassQrTokenExpirationHours: number;

    constructor(
        @Inject('PASSPORT_METADATA_REPOSITORY_TOKEN')
        private readonly passportMetadataRepository: PassportMetadataRepository,
        @Inject('JWT_REPOSITORY_TOKEN')
        private readonly jwtRepository: JwtRepository,
        private readonly config: ConfigService,
        @Inject('GOOGLE_WALLET_REPOSITORY_TOKEN')
        private readonly googleWalletRepositoryApi: GoogleWalletRepositoryApi,
        @Inject('APPLE_WALLET_REPOSITORY_TOKEN')
        private readonly appleWalletRepositoryApi: AppleWalletRepositoryApi,
    ) {
        // Default to 17520 hours (2 years) if not configured
        this.walletPassQrTokenExpirationHours =
            this.config.get<number>('WALLET_PASS_QR_TOKEN_EXPIRATION_HOURS') || 17520;
    }

    async generateApplePass(tokenId: string): Promise<WalletPassData> {
        try {
            this.logger.log(`Generating Apple Wallet pass for token ID: ${tokenId}`);

            // TODO: Remove this hardcoded mock and implement proper metadata generation
            // This is a temporary solution for testing without database setup
            if (this.isMockTokenId(tokenId)) {
                this.logger.log(`Using hardcoded mock response for token ID: ${tokenId}`);

                // Get mock metadata based on token ID
                const mockMetadata = this.getMockMetadata(tokenId);

                // Generate QR code token (mock for testing)
                const qrToken = `tourii-passport-${tokenId}-${Date.now()}`;

                // Create pass using AppleWalletRepositoryApi
                const passBuffer = await this.appleWalletRepositoryApi.createPkpassFile(
                    mockMetadata,
                    qrToken,
                    tokenId,
                    true,
                );

                // Generate download URL
                const passUrl = this.appleWalletRepositoryApi.getDownloadUrl(tokenId);

                // No expiration for static passes
                const expiresAt = new Date('2099-12-31T23:59:59Z');

                return {
                    tokenId,
                    passBuffer,
                    passUrl,
                    platform: 'apple',
                    expiresAt,
                };
            }

            // Get passport metadata
            const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);

            // Generate QR code token
            const qrToken = this.jwtRepository.generateQrToken(
                tokenId,
                this.walletPassQrTokenExpirationHours,
            );

            // Create pass using AppleWalletRepositoryApi
            const passBuffer = await this.appleWalletRepositoryApi.createPkpassFile(
                metadata,
                qrToken,
                tokenId,
            );

            // Generate download URL
            const passUrl = this.appleWalletRepositoryApi.getDownloadUrl(tokenId);

            const expiresAt = new Date();

            return {
                tokenId,
                passBuffer,
                passUrl,
                platform: 'apple',
                expiresAt,
            };
        } catch (error) {
            this.logger.error(`Failed to generate Apple pass for token ID ${tokenId}:`, error);
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
        }
    }

    async generateGooglePass(tokenId: string): Promise<WalletPassData> {
        try {
            this.logger.log(`Generating Google Pay pass for token ID: ${tokenId}`);

            // TODO: Remove this hardcoded mock and implement proper metadata generation
            // This is a temporary solution for testing without database setup
            if (this.isMockTokenId(tokenId)) {
                this.logger.log(
                    `Using hardcoded mock response for Google pass token ID: ${tokenId}`,
                );

                // Get mock metadata based on token ID
                const mockMetadata = this.getMockMetadata(tokenId);

                // Build the pass object for Google Wallet
                const passObject = {
                    genericObjects: [
                        {
                            id: `${this.config.get('GOOGLE_WALLET_ISSUER_ID')}.${this.config.get('GOOGLE_WALLET_CLASS_ID')}_${tokenId}`,
                            classId: `${this.config.get('GOOGLE_WALLET_ISSUER_ID')}.${this.config.get('GOOGLE_WALLET_CLASS_ID')}`,
                            state: 'ACTIVE',
                            logo: {
                                sourceUri: {
                                    uri: this.config.get('GOOGLE_WALLET_LOGO_URL') || 'https://assets.tourii.com/logo.png',
                                },
                                contentDescription: {
                                    defaultValue: {
                                        language: 'en-US',
                                        value: 'Tourii Logo',
                                    },
                                },
                            },
                            hexBackgroundColor: '#AE3111', // Red
                            cardTitle: {
                                defaultValue: {
                                    language: 'ja',
                                    value: '妖怪カード',
                                },
                            },
                            header: {
                                defaultValue: {
                                    language: 'ja',
                                    value: '天津神',
                                },
                            },
                            subheader: {
                                defaultValue: {
                                    language: 'ja',
                                    value: '妖',
                                },
                            },
                            textModulesData: [
                                {
                                    id: 'desc',
                                    header: '説明',
                                    body: 'テスト用デジタルパスポート',
                                },
                                {
                                    id: 'status',
                                    header: 'ステータス',
                                    body: 'デジタルパスポート保有者',
                                },
                                {
                                    id: 'type',
                                    header: 'タイプ',
                                    body: '旅行者パス',
                                },
                                {
                                    id: 'network',
                                    header: 'ネットワーク',
                                    body: 'Vara Network',
                                },
                                {
                                    id: 'premium',
                                    header: 'プレミアムステータス',
                                    body:
                                        mockMetadata.attributes.find(
                                            (a) => a.trait_type === 'Premium Status',
                                        )?.value || 'スタンダード',
                                },
                            ],
                            barcode: {
                                type: 'QR_CODE',
                                value: this.jwtRepository.generateQrToken(
                                    tokenId,
                                    this.walletPassQrTokenExpirationHours,
                                ),
                                renderEncoding: 'UTF_8',
                                alternateText: `Tourii Passport ${tokenId}`,
                            },
                        },
                    ],
                };

                // --- Use real Google Wallet API with mock data ---
                this.logger.log(
                    `Step 1: Creating class template for issuer: ${this.config.get('GOOGLE_WALLET_ISSUER_ID')}, class: ${this.config.get('GOOGLE_WALLET_CLASS_ID')}`,
                );

                // First ensure the class exists with minimal template
                const classTemplate = {
                    id: `${this.config.get('GOOGLE_WALLET_ISSUER_ID')}.${this.config.get('GOOGLE_WALLET_CLASS_ID')}`,
                };

                this.logger.log(
                    `Step 2: Skipping class creation (assuming it exists): ${classTemplate.id}`,
                );
                // Skip class creation since you created it manually
                // await this.googleWalletRepositoryApi.ensureClassExists(classTemplate);

                this.logger.log(`Step 3: Creating signed JWT`);
                const jwt = this.googleWalletRepositoryApi.createSignedJwt(passObject);

                this.logger.log(`Step 4: Getting save URL`);
                const passUrl = this.googleWalletRepositoryApi.getSaveUrl(jwt);

                // No expiration for static passes
                const expiresAt = new Date('2099-12-31T23:59:59Z');

                return {
                    tokenId,
                    passBuffer: Buffer.from(JSON.stringify(passObject)), // Mock pass object as buffer
                    passUrl,
                    platform: 'google',
                    expiresAt,
                };
                // -----------------------------------------------
            }

            // Check for required Google Wallet configurations
            const issuerId = this.config.get('GOOGLE_WALLET_ISSUER_ID');
            const classId = this.config.get('GOOGLE_WALLET_CLASS_ID');
            const keyPath = this.config.get('GOOGLE_WALLET_KEY_PATH');
            const serviceAccountJson = this.config.get('GOOGLE_WALLET_SERVICE_ACCOUNT_JSON');

            if (!issuerId || !classId || (!keyPath && !serviceAccountJson)) {
                this.logger.error(
                    'Missing required Google Wallet configuration: ISSUER_ID, CLASS_ID, and either KEY_PATH or SERVICE_ACCOUNT_JSON',
                );
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_035);
            }

            // For non-mock, use real metadata and GoogleWalletRepositoryApi
            const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);

            // Generate QR token for the pass
            const qrToken = this.jwtRepository.generateQrToken(
                tokenId,
                this.walletPassQrTokenExpirationHours,
            );

            // Build pass object using the createGooglePassObject method
            const passObject = this.createGooglePassObject(metadata, qrToken, tokenId);

            // Use GoogleWalletRepositoryApi for JWT signing and URL generation
            const jwt = this.googleWalletRepositoryApi.createSignedJwt(passObject);
            const passUrl = this.googleWalletRepositoryApi.getSaveUrl(jwt);

            const expiresAt = new Date();

            return {
                tokenId,
                passBuffer: Buffer.from(JSON.stringify(passObject)),
                passUrl,
                platform: 'google',
                expiresAt,
            };
        } catch (error) {
            this.logger.error(`Failed to generate Google pass for token ID ${tokenId}:`, error);
            throw error; // Throw original error to see what's failing
        }
    }

    async generateAutoPass(tokenId: string, deviceInfo: DeviceInfo): Promise<WalletPassData> {
        if (deviceInfo.platform === 'ios') {
            return this.generateApplePass(tokenId);
        } else if (deviceInfo.platform === 'android') {
            return this.generateGooglePass(tokenId);
        } else {
            // Default to Apple for web/unknown
            return this.generateApplePass(tokenId);
        }
    }

    async generateBothPasses(
        tokenId: string,
    ): Promise<{ apple: WalletPassData; google: WalletPassData }> {
        const [apple, google] = await Promise.all([
            this.generateApplePass(tokenId),
            this.generateGooglePass(tokenId),
        ]);

        return { apple, google };
    }

    async updatePass(tokenId: string, platform: 'apple' | 'google'): Promise<WalletPassData> {
        if (platform === 'apple') {
            return this.generateApplePass(tokenId);
        } else {
            return this.generateGooglePass(tokenId);
        }
    }

    async revokePass(tokenId: string, platform: 'apple' | 'google'): Promise<boolean> {
        try {
            this.logger.log(`Revoking ${platform} pass for token ID: ${tokenId}`);
            // In a real implementation, this would notify Apple/Google to revoke the pass
            // For now, we just log the action
            return true;
        } catch (error) {
            this.logger.error(`Failed to revoke ${platform} pass for token ID ${tokenId}:`, error);
            return false;
        }
    }

    detectPlatform(userAgent: string): DeviceInfo {
        const platform = userAgent.toLowerCase();

        if (platform.includes('iphone') || platform.includes('ipad') || platform.includes('ipod')) {
            return { userAgent, platform: 'ios' };
        } else if (platform.includes('android')) {
            return { userAgent, platform: 'android' };
        } else {
            return { userAgent, platform: 'web' };
        }
    }

    // --- GOOGLE WALLET PRODUCTION SETUP ---
    // TODO: Google Wallet Production Setup
    // - Register as a Google Wallet Issuer in the Google Pay & Wallet Console
    // - Create a Service Account and download the private key JSON
    // - Register your pass class (e.g., tourii_passport) in the Google Wallet console
    // - Use the service account to sign the JWT in createGooglePassJwt()
    // - Replace the mock JWT (alg: 'none') with a real signed JWT (alg: 'RS256')
    // - Add your logo and any images as HTTPS URLs in the pass object
    // - Use the real issuerId and classId in the pass object
    // - Test the Save to Google Wallet link on a real device
    // --- END GOOGLE WALLET PRODUCTION SETUP ---

    private createGooglePassObject(
        metadata: DigitalPassportMetadata,
        qrToken: string,
        tokenId: string,
    ): GooglePassObject {
        const issuerId = this.config.get('GOOGLE_WALLET_ISSUER_ID') || 'tourii';
        const classId = this.config.get('GOOGLE_WALLET_CLASS_ID') || 'tourii_passport';

        // Extract attributes for easier access
        // const username = String(
        //     metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Username')
        //         ?.value || 'Unknown'
        // );
        const level = String(
            metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Level')?.value ||
                'Unknown',
        );
        const premiumStatus = String(
            metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Premium Status')
                ?.value || 'Standard',
        );

        // Return the pass object in the format expected by GoogleWalletRepositoryApi
        return {
            genericObjects: [
                {
                    id: `${issuerId}.${tokenId}`,
                    classId: `${issuerId}.${classId}`,
                    state: 'ACTIVE',
                    barcode: {
                        type: 'QR_CODE',
                        value: qrToken,
                        renderEncoding: 'UTF_8',
                        alternateText: `Tourii Passport ${tokenId}`,
                    },
                    cardTitle: {
                        defaultValue: {
                            language: 'en-US',
                            value: 'Tourii Digital Passport',
                        },
                        translatedValues: [
                            {
                                language: 'ja',
                                value: 'トゥーリデジタルパスポート',
                            },
                        ],
                    },
                    header: {
                        defaultValue: {
                            language: 'en-US',
                            value: level,
                        },
                    },
                    subheader: {
                        defaultValue: {
                            language: 'en-US',
                            value: tokenId,
                        },
                    },
                    textModulesData: [
                        {
                            id: 'status',
                            header: 'Status',
                            body: 'Digital Passport Holder',
                        },
                        {
                            id: 'category',
                            header: 'Category',
                            body: 'Traveler Pass',
                        },
                        {
                            id: 'network',
                            header: 'Network',
                            body: 'Vara Network',
                        },
                        {
                            id: 'premium',
                            header: 'Premium Status',
                            body: premiumStatus,
                        },
                    ],
                    hexBackgroundColor: '#677EEA',
                    logo: {
                        sourceUri: {
                            uri:
                                this.config.get('GOOGLE_WALLET_LOGO_URL') ||
                                'https://assets.tourii.com/logo.png',
                        },
                    },
                },
            ],
        };
    }

    /**
     * Check if token ID is a mock/test token
     */
    private isMockTokenId(tokenId: string): boolean {
        const mockTokenIds = [
            '123',
            '456',
            '789',
            'test-user-1',
            'test-user-2',
            'test-user-3',
            'alice',
            'bob',
            'charlie',
        ];
        return mockTokenIds.includes(tokenId);
    }

    /**
     * Get mock metadata based on token ID
     */
    private getMockMetadata(tokenId: string): DigitalPassportMetadata {
        const mockProfiles: Record<string, DigitalPassportMetadata> = {
            '123': {
                name: 'デジタルパスポート #123',
                description: 'テスト用デジタルパスポート',
                image: 'https://example.com/passport-image.png',
                attributes: [
                    { trait_type: 'Username', value: 'テストユーザー' },
                    { trait_type: 'Level', value: 'Eクラス 天津神' },
                    { trait_type: 'Passport Type', value: '天津神' },
                    { trait_type: 'Quests Completed', value: 15 },
                    { trait_type: 'Travel Distance', value: 250 },
                    { trait_type: 'Magatama Points', value: 1500 },
                    { trait_type: 'Premium Status', value: 'プレミアム' },
                    { trait_type: 'CardType', value: '妖怪' },
                    { trait_type: 'CardKanji', value: '妖' },
                ],
            },
            '456': {
                name: 'Digital Passport #456',
                description: 'Advanced Traveler Profile',
                image: 'https://example.com/passport-image-456.png',
                attributes: [
                    { trait_type: 'Username', value: 'AdvancedUser' },
                    { trait_type: 'Level', value: 'S級 国津神' },
                    { trait_type: 'Passport Type', value: '国津神' },
                    { trait_type: 'Quests Completed', value: 42 },
                    { trait_type: 'Travel Distance', value: 1250 },
                    { trait_type: 'Magatama Points', value: 8500 },
                    { trait_type: 'Premium Status', value: 'Premium Plus' },
                    { trait_type: 'CardType', value: '神' },
                    { trait_type: 'CardKanji', value: '神' },
                ],
            },
            '789': {
                name: 'パスポート #789',
                description: '初心者向けデジタルパスポート',
                image: 'https://example.com/passport-image-789.png',
                attributes: [
                    { trait_type: 'Username', value: '初心者さん' },
                    { trait_type: 'Level', value: 'F級 地神' },
                    { trait_type: 'Passport Type', value: '地神' },
                    { trait_type: 'Quests Completed', value: 3 },
                    { trait_type: 'Travel Distance', value: 25 },
                    { trait_type: 'Magatama Points', value: 150 },
                    { trait_type: 'Premium Status', value: 'スタンダード' },
                    { trait_type: 'CardType', value: '人' },
                    { trait_type: 'CardKanji', value: '人' },
                ],
            },
            alice: {
                name: "Alice's Travel Pass",
                description: 'Explorer and Adventure Seeker',
                image: 'https://example.com/alice-passport.png',
                attributes: [
                    { trait_type: 'Username', value: 'Alice Explorer' },
                    { trait_type: 'Level', value: 'A級 山神' },
                    { trait_type: 'Passport Type', value: '山神' },
                    { trait_type: 'Quests Completed', value: 28 },
                    { trait_type: 'Travel Distance', value: 875 },
                    { trait_type: 'Magatama Points', value: 4200 },
                    { trait_type: 'Premium Status', value: 'Premium' },
                    { trait_type: 'CardType', value: '精霊' },
                    { trait_type: 'CardKanji', value: '精' },
                ],
            },
            bob: {
                name: "Bob's Digital ID",
                description: 'Tech Enthusiast Traveler',
                image: 'https://example.com/bob-passport.png',
                attributes: [
                    { trait_type: 'Username', value: 'Bob TechGuru' },
                    { trait_type: 'Level', value: 'B級 水神' },
                    { trait_type: 'Passport Type', value: '水神' },
                    { trait_type: 'Quests Completed', value: 19 },
                    { trait_type: 'Travel Distance', value: 640 },
                    { trait_type: 'Magatama Points', value: 2800 },
                    { trait_type: 'Premium Status', value: 'Standard' },
                    { trait_type: 'CardType', value: '龍' },
                    { trait_type: 'CardKanji', value: '龍' },
                ],
            },
            'test-user-1': {
                name: 'Test User Alpha',
                description: 'Development Testing Profile',
                image: 'https://example.com/test-passport-1.png',
                attributes: [
                    { trait_type: 'Username', value: 'TestAlpha' },
                    { trait_type: 'Level', value: 'C級 火神' },
                    { trait_type: 'Passport Type', value: '火神' },
                    { trait_type: 'Quests Completed', value: 12 },
                    { trait_type: 'Travel Distance', value: 380 },
                    { trait_type: 'Magatama Points', value: 1950 },
                    { trait_type: 'Premium Status', value: 'Standard' },
                    { trait_type: 'CardType', value: '鳥' },
                    { trait_type: 'CardKanji', value: '鳥' },
                ],
            },
        };

        return mockProfiles[tokenId] || mockProfiles['123']; // Fallback to default
    }
}
