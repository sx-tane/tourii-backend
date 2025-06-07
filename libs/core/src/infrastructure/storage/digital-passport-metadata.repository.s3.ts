import { DigitalPassportMetadataRepository } from '@app/core/domain/passport/digital-passport-metadata.repository';
import { S3Service } from '@app/core/provider/S3.service';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DigitalPassportMetadataRepositoryS3 implements DigitalPassportMetadataRepository {
    private readonly logger = new Logger(DigitalPassportMetadataRepositoryS3.name);
    private readonly bucket: string;
    private readonly baseUrl: string;

    constructor(
        private readonly s3Service: S3Service,
        private readonly configService: ConfigService,
    ) {
        this.bucket =
            this.configService.get<string>('PASSPORT_METADATA_BUCKET') ?? 'tourii-passport';
        this.baseUrl = this.configService.get<string>('PASSPORT_METADATA_BASE_URL') ?? '';
    }

    async uploadMetadata(passportId: string, metadata: unknown): Promise<string> {
        const key = `metadata/${passportId}.json`;
        await this.s3Service.getS3Client().send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: JSON.stringify(metadata),
                ACL: 'public-read',
                ContentType: 'application/json',
                CacheControl: 'public, max-age=31536000',
            }),
        );
        const url = `${this.baseUrl}/metadata/${passportId}.json`;
        this.logger.log(`Uploaded passport metadata to ${url}`);
        return url;
    }
}
