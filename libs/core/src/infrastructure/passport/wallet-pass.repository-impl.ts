import { JwtRepository } from '@app/core/domain/auth/jwt.repository';
import {
    DigitalPassportMetadata,
    PassportAttribute,
} from '@app/core/domain/passport/digital-passport-metadata';
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
    ) {}

    async generateApplePass(tokenId: string): Promise<WalletPassData> {
        try {
            this.logger.log(`Generating Apple Wallet pass for token ID: ${tokenId}`);

            // TODO: Remove this hardcoded mock and implement proper metadata generation
            // This is a temporary solution for testing without database setup
            if (tokenId === '123') {
                this.logger.log(`Using hardcoded mock response for token ID: ${tokenId}`);

                const mockMetadata = {
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
                };

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
            const qrToken = this.jwtRepository.generateQrToken(tokenId, 168); // 7 days

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

            // Check for required Google Wallet configurations
            const requiredConfigs = [
                'GOOGLE_WALLET_ISSUER_ID',
                'GOOGLE_WALLET_CLASS_ID',
                'GOOGLE_WALLET_KEY_PATH',
            ];

            for (const configKey of requiredConfigs) {
                if (!this.config.get(configKey)) {
                    this.logger.error(`Missing required Google Wallet configuration: ${configKey}`);
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
                }
            }

            if (tokenId === '123') {
                this.logger.log(
                    `Using hardcoded mock response for Google pass token ID: ${tokenId}`,
                );

                // Japanese/brand style mock
                const mockMetadata = {
                    name: 'デジタルパスポート #123',
                    description: 'テスト用デジタルパスポート',
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
                };

                // Build the pass object for Google Wallet
                const passObject = {
                    genericObjects: [
                        {
                            id: `tourii.123`,
                            classId: `tourii.tourii_passport`,
                            state: 'ACTIVE',
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
                        },
                    ],
                };

                // --- Use GoogleWalletRepositoryApi for JWT and Save URL ---
                const jwt = this.googleWalletRepositoryApi.createSignedJwt(passObject);
                const passUrl = this.googleWalletRepositoryApi.getSaveUrl(jwt);
                // ---------------------------------------------------------

                // No expiration for static passes
                const expiresAt = new Date('2099-12-31T23:59:59Z');

                return {
                    tokenId,
                    passBuffer: Buffer.from(JSON.stringify(mockMetadata)), // Mock buffer
                    passUrl,
                    platform: 'google',
                    expiresAt,
                };
            }

            // For non-mock, use real metadata and GoogleWalletRepositoryApi
            const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);

            // Generate QR token for the pass
            const qrToken = this.jwtRepository.generateQrToken(tokenId, 168); // 7 days

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
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
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
    ): any {
        const issuerId = this.config.get('GOOGLE_WALLET_ISSUER_ID') || 'tourii';
        const classId = this.config.get('GOOGLE_WALLET_CLASS_ID') || 'tourii_passport';

        // Extract attributes for easier access
        const username =
            metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Username')
                ?.value || 'Unknown';
        const level =
            metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Level')?.value ||
            'Unknown';
        const premiumStatus =
            metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Premium Status')
                ?.value || 'Standard';

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
                            value: username,
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
}
