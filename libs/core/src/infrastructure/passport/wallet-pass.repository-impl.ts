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
import * as crypto from 'crypto';
import JSZip from 'jszip';

@Injectable()
export class WalletPassRepositoryImpl implements WalletPassRepository {
    private readonly logger = new Logger(WalletPassRepositoryImpl.name);

    constructor(
        @Inject('PASSPORT_METADATA_REPOSITORY_TOKEN')
        private readonly passportMetadataRepository: PassportMetadataRepository,
        @Inject('JWT_REPOSITORY_TOKEN')
        private readonly jwtRepository: JwtRepository,
        private readonly config: ConfigService,
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

                // Create pass
                const passBuffer = await this.createPkpassFile(
                    mockMetadata,
                    qrToken,
                    tokenId,
                    true,
                );

                // Generate download URL
                const passUrl = `${this.config.get('BASE_URL')}/api/wallet/apple/pass?tokenId=${tokenId}`;

                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);

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

            // Create pass
            const passBuffer = await this.createPkpassFile(metadata, qrToken, tokenId);

            // Generate download URL
            const passUrl = `${this.config.get('BASE_URL')}/api/wallet/apple/pass?tokenId=${tokenId}`;

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

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
            if (tokenId === '123') {
                this.logger.log(
                    `Using hardcoded mock response for Google pass token ID: ${tokenId}`,
                );

                const mockMetadata = {
                    name: 'Tourii Digital Passport #123',
                    description: 'Digital passport for testing purposes',
                    image: 'https://example.com/passport-image.png',
                    attributes: [
                        { trait_type: 'Username', value: 'testuser' },
                        { trait_type: 'Level', value: 'E-Class Amatsukami' },
                        { trait_type: 'Passport Type', value: 'Amatsukami' },
                        { trait_type: 'Quests Completed', value: 15 },
                        { trait_type: 'Travel Distance', value: 250 },
                        { trait_type: 'Magatama Points', value: 1500 },
                        { trait_type: 'Premium Status', value: 'Premium' },
                    ],
                };

                // Generate QR code token
                const qrToken = this.jwtRepository.generateQrToken(tokenId, 168); // 7 days

                // Create Google Pay pass URL (mock)
                const passUrl = `https://pay.google.com/gp/v/save/${qrToken}`;

                const expiresAt = new Date();
                expiresAt.setDate(expiresAt.getDate() + 7);

                return {
                    tokenId,
                    passBuffer: Buffer.from(JSON.stringify(mockMetadata)), // Mock buffer
                    passUrl,
                    platform: 'google',
                    expiresAt,
                };
            }

            // Get passport metadata
            const metadata = await this.passportMetadataRepository.generateMetadata(tokenId);

            // Generate QR code token
            const qrToken = this.jwtRepository.generateQrToken(tokenId, 168); // 7 days

            // Create Google Pay pass URL
            const passUrl = `https://pay.google.com/gp/v/save/${qrToken}`;

            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7);

            return {
                tokenId,
                passBuffer: Buffer.from(JSON.stringify(metadata)),
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

    private async createPkpassFile(
        metadata: DigitalPassportMetadata,
        qrToken: string,
        tokenId: string,
        japaneseStyle = false,
    ): Promise<Buffer> {
        try {
            const zip = new JSZip();

            // Use Japanese style and color palette if requested
            const passData = japaneseStyle
                ? {
                      description: metadata.description,
                      formatVersion: 1,
                      organizationName: 'トゥーリ',
                      passTypeIdentifier:
                          this.config.get('APPLE_PASS_TYPE_ID') || 'pass.com.tourii.passport',
                      serialNumber: tokenId,
                      teamIdentifier: this.config.get('APPLE_TEAM_ID') || 'TOURII',
                      voided: false,
                      barcode: {
                          message: qrToken,
                          format: 'PKBarcodeFormatQR',
                          messageEncoding: 'iso-8859-1',
                      },
                      barcodes: [
                          {
                              message: qrToken,
                              format: 'PKBarcodeFormatQR',
                              messageEncoding: 'iso-8859-1',
                          },
                      ],
                      generic: {
                          headerFields: [
                              {
                                  key: 'header',
                                  label: '妖怪',
                                  value: '妖',
                              },
                          ],
                          primaryFields: [
                              {
                                  key: 'type',
                                  label: '天津神',
                                  value: '国',
                              },
                          ],
                          secondaryFields: [
                              {
                                  key: 'desc',
                                  label: '妖怪',
                                  value: '妖',
                              },
                          ],
                          auxiliaryFields: [
                              {
                                  key: 'quests',
                                  label: 'クエスト達成',
                                  value: String(
                                      metadata.attributes.find(
                                          (a) => a.trait_type === 'Quests Completed',
                                      )?.value || 0,
                                  ),
                              },
                              {
                                  key: 'distance',
                                  label: '移動距離',
                                  value: `${Math.floor((metadata.attributes.find((a) => a.trait_type === 'Travel Distance')?.value as number) || 0)} km`,
                              },
                          ],
                          backFields: [
                              {
                                  key: 'tokenId',
                                  label: 'トークンID',
                                  value: tokenId,
                              },
                              {
                                  key: 'points',
                                  label: 'マガタマポイント',
                                  value: String(
                                      metadata.attributes.find(
                                          (a) => a.trait_type === 'Magatama Points',
                                      )?.value || 0,
                                  ),
                              },
                              {
                                  key: 'premium',
                                  label: 'プレミアムステータス',
                                  value:
                                      metadata.attributes.find(
                                          (a) => a.trait_type === 'Premium Status',
                                      )?.value || 'スタンダード',
                              },
                          ],
                      },
                      backgroundColor: '#AE3111', // Red
                      foregroundColor: '#E3E3DC', // Warm Grey
                      labelColor: '#B6AD33', // Mustard
                  }
                : {
                      description: metadata.description,
                      formatVersion: 1,
                      organizationName: 'Tourii',
                      passTypeIdentifier:
                          this.config.get('APPLE_PASS_TYPE_ID') || 'pass.com.tourii.passport',
                      serialNumber: tokenId,
                      teamIdentifier: this.config.get('APPLE_TEAM_ID') || 'TOURII',
                      voided: false,
                      barcode: {
                          message: qrToken,
                          format: 'PKBarcodeFormatQR',
                          messageEncoding: 'iso-8859-1',
                      },
                      barcodes: [
                          {
                              message: qrToken,
                              format: 'PKBarcodeFormatQR',
                              messageEncoding: 'iso-8859-1',
                          },
                      ],
                      generic: {
                          headerFields: [
                              {
                                  key: 'header',
                                  label: 'TOURII',
                                  value: 'Digital Passport',
                              },
                          ],
                          primaryFields: [
                              {
                                  key: 'name',
                                  label: 'Passport Holder',
                                  value:
                                      metadata.attributes.find(
                                          (a: PassportAttribute) => a.trait_type === 'Username',
                                      )?.value || 'Unknown',
                              },
                          ],
                          secondaryFields: [
                              {
                                  key: 'level',
                                  label: 'Level',
                                  value:
                                      metadata.attributes.find(
                                          (a: PassportAttribute) => a.trait_type === 'Level',
                                      )?.value || 'Unknown',
                              },
                              {
                                  key: 'type',
                                  label: 'Type',
                                  value:
                                      metadata.attributes.find(
                                          (a: PassportAttribute) =>
                                              a.trait_type === 'Passport Type',
                                      )?.value || 'Unknown',
                              },
                          ],
                          auxiliaryFields: [
                              {
                                  key: 'quests',
                                  label: 'Quests Completed',
                                  value: String(
                                      metadata.attributes.find(
                                          (a: PassportAttribute) =>
                                              a.trait_type === 'Quests Completed',
                                      )?.value || 0,
                                  ),
                              },
                              {
                                  key: 'distance',
                                  label: 'Travel Distance',
                                  value: `${Math.floor((metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Travel Distance')?.value as number) || 0)} km`,
                              },
                          ],
                          backFields: [
                              {
                                  key: 'tokenId',
                                  label: 'Token ID',
                                  value: tokenId,
                              },
                              {
                                  key: 'points',
                                  label: 'Magatama Points',
                                  value: String(
                                      metadata.attributes.find(
                                          (a: PassportAttribute) =>
                                              a.trait_type === 'Magatama Points',
                                      )?.value || 0,
                                  ),
                              },
                              {
                                  key: 'premium',
                                  label: 'Premium Status',
                                  value:
                                      metadata.attributes.find(
                                          (a: PassportAttribute) =>
                                              a.trait_type === 'Premium Status',
                                      )?.value || 'Standard',
                              },
                          ],
                      },
                      backgroundColor: 'rgb(103, 126, 234)',
                      foregroundColor: 'rgb(255, 255, 255)',
                      labelColor: 'rgb(200, 200, 200)',
                  };

            // Add pass.json to zip
            zip.file('pass.json', JSON.stringify(passData, null, 2));

            // Create manifest.json (list of all files in the pass)
            const manifestData = {
                'pass.json': crypto
                    .createHash('sha1')
                    .update(JSON.stringify(passData, null, 2))
                    .digest('hex'),
            };

            // Add manifest.json to zip
            zip.file('manifest.json', JSON.stringify(manifestData, null, 2));

            // Create signature (mock signature for testing)
            // In production, this should be signed with Apple's certificate
            const manifestString = JSON.stringify(manifestData, null, 2);
            const signature = crypto
                .createHmac('sha256', 'mock-secret-key')
                .update(manifestString)
                .digest('base64');

            // Add signature to zip
            zip.file('signature', signature);

            // Generate the .pkpass file as a buffer
            const pkpassBuffer = await zip.generateAsync({ type: 'nodebuffer' });

            this.logger.log(
                `Generated .pkpass file for token ID ${tokenId}, size: ${pkpassBuffer.length} bytes`,
            );

            return pkpassBuffer;
        } catch (error) {
            this.logger.error('Error creating .pkpass file:', error);
            throw error;
        }
    }

    private createGooglePassObject(
        metadata: DigitalPassportMetadata,
        qrToken: string,
        tokenId: string,
    ): any {
        const issuerEmail = this.config.get('GOOGLE_WALLET_ISSUER_EMAIL');
        const issuerId = this.config.get('GOOGLE_WALLET_ISSUER_ID');

        return {
            iss: issuerEmail,
            aud: 'google',
            typ: 'savetowallet',
            payload: {
                genericObjects: [
                    {
                        id: `${issuerId}.${tokenId}`,
                        classId: `${issuerId}.tourii_passport`,
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
                        },
                        subheader: {
                            defaultValue: {
                                language: 'en-US',
                                value:
                                    metadata.attributes.find(
                                        (a: PassportAttribute) => a.trait_type === 'Username',
                                    )?.value || 'Unknown',
                            },
                        },
                        header: {
                            defaultValue: {
                                language: 'en-US',
                                value:
                                    metadata.attributes.find(
                                        (a: PassportAttribute) => a.trait_type === 'Level',
                                    )?.value || 'Unknown',
                            },
                        },
                        textModulesData: [
                            {
                                id: 'quests',
                                header: 'Quests Completed',
                                body: String(
                                    metadata.attributes.find(
                                        (a: PassportAttribute) =>
                                            a.trait_type === 'Quests Completed',
                                    )?.value || 0,
                                ),
                            },
                            {
                                id: 'distance',
                                header: 'Travel Distance',
                                body: `${Math.floor((metadata.attributes.find((a: PassportAttribute) => a.trait_type === 'Travel Distance')?.value as number) || 0)} km`,
                            },
                            {
                                id: 'points',
                                header: 'Magatama Points',
                                body: String(
                                    metadata.attributes.find(
                                        (a: PassportAttribute) =>
                                            a.trait_type === 'Magatama Points',
                                    )?.value || 0,
                                ),
                            },
                        ],
                        hexBackgroundColor: '#677EEA',
                        logo: {
                            sourceUri: {
                                uri: 'https://assets.tourii.com/logo.png',
                            },
                        },
                    },
                ],
            },
        };
    }

    private createGooglePassJwt(passObject: any): string {
        // In a real implementation, this would be properly signed with Google credentials
        // For now, we'll create a basic JWT structure
        const header = Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString(
            'base64url',
        );
        const payload = Buffer.from(JSON.stringify(passObject)).toString('base64url');

        // Note: This should be properly signed with Google credentials in production
        const signature = 'signature-placeholder';

        return `${header}.${payload}.${signature}`;
    }
}
