import { S3Client, type S3ClientConfig } from '@aws-sdk/client-s3';
import { Injectable, Logger, type OnApplicationShutdown, type OnModuleInit } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service implements OnModuleInit, OnApplicationShutdown {
    constructor(private configService: ConfigService) {}

    private s3Client: S3Client;

    async onModuleInit() {
        const env: string | undefined = this.configService.get<string>('NODE_ENV')?.toUpperCase();
        const config: S3ClientConfig = {
            endpoint: this.configService.get<string>(`AWS_S3_ENDPOINT_${env}`),
            region: this.configService.get<string>('AWS_REGION'),
            credentials: {
                accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID') ?? 'FAKE',
                secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY') ?? 'FAKE',
            },
            forcePathStyle: true,
        };
        this.s3Client = new S3Client(config);
    }

    async onApplicationShutdown() {
        this.s3Client.destroy();
    }

    get getS3Client() {
        if (!this.s3Client) {
            Logger.error('S3Clientが初期化されていません');
            throw new Error('S3Clientが初期化されていません');
        }
        return this.s3Client;
    }
}
