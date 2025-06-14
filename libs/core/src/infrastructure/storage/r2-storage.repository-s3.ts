import { R2StorageRepository } from '@app/core/domain/storage/r2-storage.repository';
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
            throw new Error(
                'R2 endpoint not configured. Set R2_ENDPOINT or R2_ACCOUNT_ID environment variable',
            );
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

    async uploadProofImage(file: Buffer, key: string, contentType: string): Promise<string> {
        try {
            const bucket = this.config.get<string>('R2_BUCKET');

            if (!bucket) {
                throw new Error('R2_BUCKET environment variable is not set');
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
            throw new Error(
                `R2 upload failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    generatePublicUrl(key: string): string {
        const customDomain = this.config.get<string>('R2_PUBLIC_DOMAIN')?.replace(/\/$/, '');

        if (customDomain) {
            // Use custom domain if configured
            return `https://${customDomain}/${key}`;
        }

        throw new Error(
            'R2 public domain not configured. Set R2_PUBLIC_DOMAIN, or both R2_ACCOUNT_ID and R2_BUCKET environment variables',
        );
    }
}
