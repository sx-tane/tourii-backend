import { R2StorageRepository } from '@app/core/domain/storage/r2-storage.repository';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class R2StorageRepositoryS3 implements R2StorageRepository {
    private readonly logger = new Logger(R2StorageRepositoryS3.name);
    private s3Client: S3Client;

    constructor(private readonly config: ConfigService) {
        this.initializeR2Client();
    }

    private initializeR2Client() {
        const r2AccountId = this.config.get<string>('R2_ACCOUNT_ID');

        // R2 endpoint format: https://{account_id}.r2.cloudflarestorage.com
        const endpoint = r2AccountId
            ? `https://${r2AccountId}.r2.cloudflarestorage.com`
            : undefined;

        if (!endpoint) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_035);
        }

        this.s3Client = new S3Client({
            endpoint: endpoint,
            region: this.config.get<string>('AWS_REGION') || 'auto',
            credentials: {
                accessKeyId:
                    this.config.get<string>('AWS_ACCESS_KEY_ID') ||
                    this.config.get<string>('R2_ACCESS_KEY_ID') ||
                    '',
                secretAccessKey:
                    this.config.get<string>('AWS_SECRET_ACCESS_KEY') ||
                    this.config.get<string>('R2_SECRET_ACCESS_KEY') ||
                    '',
            },
            forcePathStyle: true,
        });

        this.logger.log(`R2 client initialized successfully with endpoint: ${endpoint}`);
    }

    async uploadProof(file: Buffer, key: string, contentType: string): Promise<string> {
        try {
            const bucket = this.config.get<string>('R2_BUCKET');

            if (!bucket) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_036);
            }

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: file,
                ContentType: contentType,
                ACL: 'public-read',
            });

            await this.s3Client.send(command);

            const publicUrl = this.generatePublicUrl(key);
            this.logger.log(`File uploaded successfully to R2: ${publicUrl}`);

            return publicUrl;
        } catch (error) {
            this.logger.error(
                `Failed to upload file to R2: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
            );
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_037);
        }
    }

    async uploadMetadata(metadata: object, key: string): Promise<string> {
        try {
            const bucket = this.config.get<string>('R2_BUCKET');

            if (!bucket) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_036);
            }

            const metadataJson = JSON.stringify(metadata, null, 2);
            const buffer = Buffer.from(metadataJson, 'utf-8');

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: buffer,
                ContentType: 'application/json',
                ACL: 'public-read',
                CacheControl: 'max-age=3600', // Cache for 1 hour
            });

            await this.s3Client.send(command);

            const publicUrl = this.generatePublicUrl(key);
            this.logger.log(`Metadata uploaded successfully to R2: ${publicUrl}`);

            return publicUrl;
        } catch (error) {
            this.logger.error(
                `Failed to upload metadata to R2: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
            );
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_038);
        }
    }

    generatePublicUrl(key: string): string {
        const customDomain = this.config.get<string>('R2_PUBLIC_DOMAIN')?.replace(/\/$/, '');

        if (customDomain) {
            // Use custom domain if configured
            return `${customDomain}/${key}`;
        }

        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_039);
    }
}
