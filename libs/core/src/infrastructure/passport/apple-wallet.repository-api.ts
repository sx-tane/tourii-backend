import {
    DigitalPassportMetadata,
    PassportAttribute,
} from '@app/core/domain/passport/digital-passport-metadata';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import JSZip from 'jszip';

// Repository/Integration for Apple Wallet Pass Generation
@Injectable()
export class AppleWalletRepositoryApi {
    private readonly logger = new Logger(AppleWalletRepositoryApi.name);
    private passTypeIdentifier: string;
    private teamIdentifier: string;
    private organizationName: string;
    private certificatePath?: string;
    private certificatePassword?: string;

    constructor(private readonly config: ConfigService) {
        // --- APPLE WALLET PRODUCTION SETUP ---
        // Use ConfigService for all config/env values
        this.passTypeIdentifier =
            this.config.get<string>('APPLE_PASS_TYPE_ID') || 'pass.com.tourii.passport';
        this.teamIdentifier = this.config.get<string>('APPLE_TEAM_ID') || 'TOURII';
        this.organizationName = this.config.get<string>('APPLE_ORGANIZATION_NAME') || 'Tourii';
        this.certificatePath = this.config.get<string>('APPLE_CERTIFICATE_PATH');
        this.certificatePassword = this.config.get<string>('APPLE_CERTIFICATE_PASSWORD');
        // --- END APPLE WALLET PRODUCTION SETUP ---
    }

    async createPkpassFile(
        metadata: DigitalPassportMetadata,
        qrToken: string,
        tokenId: string,
        japaneseStyle = false,
    ): Promise<Buffer> {
        try {
            const zip = new JSZip();

            // Use Japanese style and color palette if requested
            const passData = japaneseStyle
                ? this.createJapanesePassData(metadata, qrToken, tokenId)
                : this.createStandardPassData(metadata, qrToken, tokenId);

            // Add pass.json to zip
            zip.file('pass.json', JSON.stringify(passData, null, 2));

            // Create manifest.json (list of all files in the pass)
            const manifestData = await this.createManifest(passData);
            zip.file('manifest.json', JSON.stringify(manifestData, null, 2));

            // Create signature
            const signature = await this.createSignature(manifestData);
            zip.file('signature', signature);

            // TODO: Add required images (icon.png, logo.png, etc.) to the ZIP
            // These should be configured via environment variables or stored in a specific location

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

    private createJapanesePassData(
        metadata: DigitalPassportMetadata,
        qrToken: string,
        tokenId: string,
    ): any {
        return {
            description: metadata.description,
            formatVersion: 1,
            organizationName: 'トゥーリ',
            passTypeIdentifier: this.passTypeIdentifier,
            serialNumber: tokenId,
            teamIdentifier: this.teamIdentifier,
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
                        key: 'status',
                        label: 'ステータス',
                        value: 'デジタルパスポート保有者',
                    },
                    {
                        key: 'type',
                        label: 'タイプ',
                        value: '旅行者パス',
                    },
                ],
                backFields: [
                    {
                        key: 'tokenId',
                        label: 'トークンID',
                        value: tokenId,
                    },
                    {
                        key: 'network',
                        label: 'ネットワーク',
                        value: 'Vara Network',
                    },
                    {
                        key: 'premium',
                        label: 'プレミアムステータス',
                        value:
                            metadata.attributes.find((a) => a.trait_type === 'Premium Status')
                                ?.value || 'スタンダード',
                    },
                ],
            },
            backgroundColor: '#AE3111', // Red
            foregroundColor: '#E3E3DC', // Warm Grey
            labelColor: '#B6AD33', // Mustard
        };
    }

    private createStandardPassData(
        metadata: DigitalPassportMetadata,
        qrToken: string,
        tokenId: string,
    ): any {
        return {
            description: metadata.description,
            formatVersion: 1,
            organizationName: this.organizationName,
            passTypeIdentifier: this.passTypeIdentifier,
            serialNumber: tokenId,
            teamIdentifier: this.teamIdentifier,
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
                                (a: PassportAttribute) => a.trait_type === 'Passport Type',
                            )?.value || 'Unknown',
                    },
                ],
                auxiliaryFields: [
                    {
                        key: 'status',
                        label: 'Status',
                        value: 'Digital Passport Holder',
                    },
                    {
                        key: 'type',
                        label: 'Type',
                        value: 'Traveler Pass',
                    },
                ],
                backFields: [
                    {
                        key: 'tokenId',
                        label: 'Token ID',
                        value: tokenId,
                    },
                    {
                        key: 'network',
                        label: 'Network',
                        value: 'Vara Network',
                    },
                    {
                        key: 'premium',
                        label: 'Premium Status',
                        value:
                            metadata.attributes.find(
                                (a: PassportAttribute) => a.trait_type === 'Premium Status',
                            )?.value || 'Standard',
                    },
                ],
            },
            backgroundColor: 'rgb(103, 126, 234)',
            foregroundColor: 'rgb(255, 255, 255)',
            labelColor: 'rgb(200, 200, 200)',
        };
    }

    private async createManifest(passData: any): Promise<Record<string, string>> {
        const manifestData: Record<string, string> = {
            'pass.json': crypto
                .createHash('sha1')
                .update(JSON.stringify(passData, null, 2))
                .digest('hex'),
        };

        // TODO: Add hashes for image files when they are added
        // 'icon.png': hash,
        // 'logo.png': hash,
        // etc.

        return manifestData;
    }

    private async createSignature(manifestData: Record<string, string>): Promise<string> {
        // --- APPLE WALLET PRODUCTION SETUP ---
        // TODO: Apple Wallet Production Setup
        // - Register for an Apple Developer account and create a Pass Type ID
        // - Download your Apple Pass certificate (.p12) and add it to your backend securely
        // - Use a library like `passkit-generator` or native crypto to sign with your certificate
        // - Replace this mock signature with a real signature using your Apple certificate

        if (this.certificatePath && this.certificatePassword) {
            // In production, load the certificate and sign the manifest
            // Example using node-forge or similar:
            // const p12 = readFileSync(this.certificatePath);
            // const forge = require('node-forge');
            // const p12Parsed = forge.pkcs12.pkcs12FromAsn1(forge.asn1.fromDer(p12.toString('binary')), this.certificatePassword);
            // ... sign the manifest ...

            this.logger.warn('Production certificate signing not yet implemented');
        }

        // Mock signature for testing
        const manifestString = JSON.stringify(manifestData, null, 2);
        const signature = crypto
            .createHmac('sha256', 'mock-secret-key')
            .update(manifestString)
            .digest('base64');

        return signature;
    }

    getDownloadUrl(tokenId: string): string {
        return `${this.config.get('BASE_URL')}/api/wallet/apple/pass?tokenId=${tokenId}`;
    }
}
