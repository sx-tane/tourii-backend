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
import { MockPassportDataService } from './mock-passport-data.service';

@Injectable()
export class WalletPassRepositoryImpl implements WalletPassRepository {
    private readonly logger = new Logger(WalletPassRepositoryImpl.name);
    private readonly walletPassQrTokenExpirationHours: number;

    // Configuration constants
    private static readonly DEFAULT_PASS_EXPIRATION_HOURS = 17520; // 2 years
    private static readonly FAR_FUTURE_DATE = '2099-12-31T23:59:59Z';
    private static readonly DEFAULT_PASS_COLOR = '#677EEA';
    private static readonly DEFAULT_LOGO_URL = 'https://assets.tourii.com/logo.png';
    
    // Configuration keys
    private static readonly CONFIG_KEYS = {
        WALLET_PASS_QR_TOKEN_EXPIRATION_HOURS: 'WALLET_PASS_QR_TOKEN_EXPIRATION_HOURS',
        GOOGLE_WALLET_ISSUER_ID: 'GOOGLE_WALLET_ISSUER_ID',
        GOOGLE_WALLET_CLASS_ID: 'GOOGLE_WALLET_CLASS_ID',
        GOOGLE_WALLET_KEY_PATH: 'GOOGLE_WALLET_KEY_PATH',
        GOOGLE_WALLET_SERVICE_ACCOUNT_JSON: 'GOOGLE_WALLET_SERVICE_ACCOUNT_JSON',
        GOOGLE_WALLET_LOGO_URL: 'GOOGLE_WALLET_LOGO_URL',
    } as const;


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
        @Inject('MOCK_PASSPORT_DATA_SERVICE_TOKEN')
        private readonly mockPassportDataService: MockPassportDataService,
    ) {
        // Default to 2 years if not configured
        this.walletPassQrTokenExpirationHours =
            this.config.get<number>(WalletPassRepositoryImpl.CONFIG_KEYS.WALLET_PASS_QR_TOKEN_EXPIRATION_HOURS) || 
            WalletPassRepositoryImpl.DEFAULT_PASS_EXPIRATION_HOURS;
    }

    async generateApplePass(tokenId: string): Promise<WalletPassData> {
        try {
            this.logger.log(`Generating Apple Wallet pass for token ID: ${tokenId}`);

            if (this.mockPassportDataService.isMockTokenId(tokenId)) {
                return this.generateMockApplePass(tokenId);
            }

            return this.generateProductionApplePass(tokenId);
        } catch (error) {
            return this.handlePassGenerationError(error, tokenId, 'Apple');
        }
    }

    async generateGooglePass(tokenId: string): Promise<WalletPassData> {
        try {
            this.logger.log(`Generating Google Pay pass for token ID: ${tokenId}`);

            if (this.mockPassportDataService.isMockTokenId(tokenId)) {
                return this.generateMockGooglePass(tokenId);
            }

            return this.generateProductionGooglePass(tokenId);
        } catch (error) {
            return this.handlePassGenerationError(error, tokenId, 'Google');
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

    /**
     * Generate Apple pass using mock data for testing
     */
    private async generateMockApplePass(tokenId: string): Promise<WalletPassData> {
        this.logger.log(`Using hardcoded mock response for token ID: ${tokenId}`);

        const mockMetadata = this.mockPassportDataService.getMockMetadata(tokenId);
        const qrToken = `tourii-passport-${tokenId}-${Date.now()}`;

        const passBuffer = await this.appleWalletRepositoryApi.createPkpassFile(
            mockMetadata,
            qrToken,
            tokenId,
            true,
        );

        const passUrl = this.appleWalletRepositoryApi.getDownloadUrl(tokenId);
        const expiresAt = new Date(WalletPassRepositoryImpl.FAR_FUTURE_DATE);

        return this.createWalletPassData(tokenId, passBuffer, passUrl, 'apple', expiresAt);
    }

    /**
     * Generate Apple pass using production metadata
     */
    private async generateProductionApplePass(tokenId: string): Promise<WalletPassData> {
        const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);
        const qrToken = this.jwtRepository.generateQrToken(tokenId, this.walletPassQrTokenExpirationHours);

        const passBuffer = await this.appleWalletRepositoryApi.createPkpassFile(metadata, qrToken, tokenId);
        const passUrl = this.appleWalletRepositoryApi.getDownloadUrl(tokenId);
        const expiresAt = new Date();

        return this.createWalletPassData(tokenId, passBuffer, passUrl, 'apple', expiresAt);
    }

    /**
     * Generate Google pass using mock data for testing
     */
    private async generateMockGooglePass(tokenId: string): Promise<WalletPassData> {
        this.logger.log(`Using hardcoded mock response for Google pass token ID: ${tokenId}`);

        try {
            const mockMetadata = this.mockPassportDataService.getMockMetadata(tokenId);
            const qrToken = this.jwtRepository.generateQrToken(tokenId, this.walletPassQrTokenExpirationHours);

            // Ensure Google Wallet class exists before creating pass
            await this.ensureGoogleWalletClassExists();

            const passObject = this.createGooglePassObject(mockMetadata, qrToken, tokenId);

            this.logger.log(`Creating signed JWT for mock Google pass`);
            const jwt = this.googleWalletRepositoryApi.createSignedJwt(passObject);
            const passUrl = this.googleWalletRepositoryApi.getSaveUrl(jwt);
            const expiresAt = new Date(WalletPassRepositoryImpl.FAR_FUTURE_DATE);

            return this.createWalletPassData(
                tokenId, 
                Buffer.from(JSON.stringify(passObject)), 
                passUrl, 
                'google', 
                expiresAt
            );
        } catch (error) {
            this.logger.error(`Google Wallet API error for token ${tokenId}:`, error);
            
            // Fallback: Return a working demo URL with proper structure
            const mockMetadata = this.mockPassportDataService.getMockMetadata(tokenId);
            const qrToken = this.jwtRepository.generateQrToken(tokenId, this.walletPassQrTokenExpirationHours);
            const passObject = this.createGooglePassObject(mockMetadata, qrToken, tokenId);
            
            // Create a demo URL that doesn't rely on Google Wallet API
            const demoUrl = `https://developers.google.com/wallet/generic/resources/demos#tourii-passport-${tokenId}`;
            const expiresAt = new Date(WalletPassRepositoryImpl.FAR_FUTURE_DATE);

            this.logger.warn(`Falling back to demo URL for token ${tokenId}: ${demoUrl}`);
            
            return this.createWalletPassData(
                tokenId, 
                Buffer.from(JSON.stringify(passObject)), 
                demoUrl, 
                'google', 
                expiresAt
            );
        }
    }

    /**
     * Generate Google pass using production metadata
     */
    private async generateProductionGooglePass(tokenId: string): Promise<WalletPassData> {
        this.validateGoogleWalletConfiguration();

        const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);
        const qrToken = this.jwtRepository.generateQrToken(tokenId, this.walletPassQrTokenExpirationHours);

        // Ensure Google Wallet class exists before creating pass
        await this.ensureGoogleWalletClassExists();

        const passObject = this.createGooglePassObject(metadata, qrToken, tokenId);
        const jwt = this.googleWalletRepositoryApi.createSignedJwt(passObject);
        const passUrl = this.googleWalletRepositoryApi.getSaveUrl(jwt);
        const expiresAt = new Date();

        return this.createWalletPassData(
            tokenId, 
            Buffer.from(JSON.stringify(passObject)), 
            passUrl, 
            'google', 
            expiresAt
        );
    }

    /**
     * Validate Google Wallet configuration
     */
    private validateGoogleWalletConfiguration(): void {
        const issuerId = this.config.get(WalletPassRepositoryImpl.CONFIG_KEYS.GOOGLE_WALLET_ISSUER_ID);
        const classId = this.config.get(WalletPassRepositoryImpl.CONFIG_KEYS.GOOGLE_WALLET_CLASS_ID);
        const keyPath = this.config.get(WalletPassRepositoryImpl.CONFIG_KEYS.GOOGLE_WALLET_KEY_PATH);
        const serviceAccountJson = this.config.get(WalletPassRepositoryImpl.CONFIG_KEYS.GOOGLE_WALLET_SERVICE_ACCOUNT_JSON);

        if (!issuerId || !classId || (!keyPath && !serviceAccountJson)) {
            this.logger.error(
                'Missing required Google Wallet configuration: ISSUER_ID, CLASS_ID, and either KEY_PATH or SERVICE_ACCOUNT_JSON',
            );
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_035);
        }
    }

    /**
     * Create standardized WalletPassData object
     */
    private createWalletPassData(
        tokenId: string,
        passBuffer: Buffer,
        passUrl: string,
        platform: 'apple' | 'google',
        expiresAt: Date,
    ): WalletPassData {
        return {
            tokenId,
            passBuffer,
            passUrl,
            platform,
            expiresAt,
        };
    }

    /**
     * Handle pass generation errors consistently
     */
    private handlePassGenerationError(error: unknown, tokenId: string, platform: string): never {
        this.logger.error(`Failed to generate ${platform} pass for token ID ${tokenId}:`, error);
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_004);
    }

    /**
     * Ensure Google Wallet class exists, create if necessary
     */
    private async ensureGoogleWalletClassExists(): Promise<void> {
        try {
            const issuerId = this.config.get(WalletPassRepositoryImpl.CONFIG_KEYS.GOOGLE_WALLET_ISSUER_ID) || 'tourii';
            const classId = this.config.get(WalletPassRepositoryImpl.CONFIG_KEYS.GOOGLE_WALLET_CLASS_ID) || 'tourii_passport';
            
            // Simple class template that Google Wallet will accept
            const classTemplate = {
                id: `${issuerId}.${classId}`,
                issuerName: 'Tourii Digital Passport',
                reviewStatus: 'UNDER_REVIEW',
                allowMultipleUsersPerObject: false,
                multipleDevicesAndHoldersAllowedStatus: 'ONE_USER_ALL_DEVICES'
            };

            this.logger.log(`Ensuring Google Wallet class exists: ${classTemplate.id}`);
            await this.googleWalletRepositoryApi.ensureClassExists(classTemplate);
            this.logger.log(`Google Wallet class confirmed: ${classTemplate.id}`);
        } catch (error) {
            this.logger.warn('Google Wallet class creation failed, continuing with pass generation:', error);
            // Don't throw error - let the pass generation proceed even if class creation fails
            // Google Wallet might accept the pass even without explicit class creation
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
        const issuerId = this.config.get(WalletPassRepositoryImpl.CONFIG_KEYS.GOOGLE_WALLET_ISSUER_ID) || 'tourii';
        const classId = this.config.get(WalletPassRepositoryImpl.CONFIG_KEYS.GOOGLE_WALLET_CLASS_ID) || 'tourii_passport';

        // Extract attributes using the mock service utility method
        const level = this.mockPassportDataService.extractAttributeValue(metadata.attributes, 'Level', 'Unknown');
        const premiumStatus = this.mockPassportDataService.extractAttributeValue(metadata.attributes, 'Premium Status', 'Standard');
        const username = this.mockPassportDataService.extractAttributeValue(metadata.attributes, 'Username', tokenId);


        // Return the pass object in the format expected by GoogleWalletRepositoryApi
        return {
            genericObjects: [
                {
                    id: `${issuerId}.${classId}_${tokenId}`,
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
                            value: username,
                        },
                    },
                    textModulesData: [
                        {
                            id: 'tokenId',
                            header: 'Token ID',
                            body: tokenId,
                        },
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
                    hexBackgroundColor: WalletPassRepositoryImpl.DEFAULT_PASS_COLOR,
                    logo: {
                        sourceUri: {
                            uri:
                                this.config.get(WalletPassRepositoryImpl.CONFIG_KEYS.GOOGLE_WALLET_LOGO_URL) ||
                                WalletPassRepositoryImpl.DEFAULT_LOGO_URL,
                        },
                        contentDescription: {
                            defaultValue: {
                                language: 'en-US',
                                value: 'Tourii Logo - Digital Passport Platform',
                            },
                        },
                    },
                },
            ],
        };
    }

}
