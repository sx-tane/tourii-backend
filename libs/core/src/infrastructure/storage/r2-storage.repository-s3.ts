import { R2StorageRepository } from '@app/core/domain/storage/r2-storage.repository';
import { S3Service } from '@app/core/provider/S3.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class R2StorageRepositoryS3 implements R2StorageRepository {
    constructor(private readonly s3Service: S3Service, private readonly config: ConfigService) {}

    async uploadProofImage(file: Buffer, key: string, contentType: string): Promise<string> {
        const bucket = this.config.get<string>('R2_BUCKET');
        await this.s3Service.getS3Client.send(
            new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: file,
                ContentType: contentType,
                ACL: 'public-read',
            }),
        );
        return this.generatePublicUrl(key);
    }

    generatePublicUrl(key: string): string {
        const domain = this.config.get<string>('R2_PUBLIC_DOMAIN')?.replace(/\/$/, '');
        return `${domain}/${key}`;
    }
}
