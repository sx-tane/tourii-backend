import { UserRepositoryDb } from '@app/core';
import { SailsCallsRepositoryApi } from '@app/core/infrastructure/api/sails-calls-repository-api';
import { EncryptionRepositoryAuth } from '@app/core/infrastructure/authentication/encryption-repository-auth';
import { JwtRepositoryAuth } from '@app/core/infrastructure/authentication/jwt-repository-auth';
import { PassportMetadataRepositoryImpl } from '@app/core/infrastructure/passport/passport-metadata.repository-impl';
import { R2StorageRepositoryS3 } from '@app/core/infrastructure/storage/r2-storage.repository-s3';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendLoggingService } from '@app/core/provider/tourii-backend-logging-service';
import { getEnv } from '@app/core/utils/env-utils';
import { HttpModule } from '@nestjs/axios';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR, HttpAdapterHost } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PassportMetadataController } from './controller/passport-metadata.controller';
import { TouriiOnchainController } from './controller/tourii-onchain.controller';
import { PassportMetadataService } from './service/passport-metadata.service';
import { TouriiOnchainService } from './service/tourii-onchain.service';
import { TouriiOnchainContextProvider } from './support/context/tourii-onchain-context-provider';
import { ErrorInterceptor } from './support/interceptors/error.interceptor';
import { SecurityMiddleware } from './support/middleware/security.middleware';
import { VersionMiddleware } from './support/middleware/version.middleware';
import { TouriiOnchainApiMiddleware } from './support/tourii-onchain-api-middleware';
import { TouriiOnchainConstants } from './tourii-onchain.constant';

@Module({
    imports: [
        HttpModule,
        ConfigModule.forRoot({
            envFilePath: `.env.${getEnv({ key: 'NODE_ENV', defaultValue: '' })}`,
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 10,
            },
        ]),
    ],
    controllers: [TouriiOnchainController, PassportMetadataController],
    providers: [
        Logger,
        TouriiBackendLoggingService,
        TouriiOnchainService,
        PassportMetadataService,
        HttpAdapterHost,
        PrismaService,
        {
            provide: TouriiOnchainConstants.CONTEXT_PROVIDER_TOKEN,
            useClass: TouriiOnchainContextProvider,
        },
        {
            provide: TouriiOnchainConstants.SAILS_CALLS_REPOSITORY_TOKEN,
            useClass: SailsCallsRepositoryApi,
        },
        {
            provide: TouriiOnchainConstants.ENCRYPTION_REPOSITORY_TOKEN,
            useClass: EncryptionRepositoryAuth,
        },
        {
            provide: TouriiOnchainConstants.JWT_REPOSITORY_TOKEN,
            useClass: JwtRepositoryAuth,
        },
        {
            provide: TouriiOnchainConstants.USER_REPOSITORY_TOKEN,
            useClass: UserRepositoryDb,
        },
        {
            provide: TouriiOnchainConstants.R2_STORAGE_REPOSITORY_TOKEN,
            useClass: R2StorageRepositoryS3,
        },
        {
            provide: TouriiOnchainConstants.PASSPORT_METADATA_REPOSITORY_TOKEN,
            useClass: PassportMetadataRepositoryImpl,
        },
        {
            provide: APP_INTERCEPTOR,
            useClass: ErrorInterceptor,
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class TouriiOnchainModule implements NestModule {
    constructor(private readonly refHost: HttpAdapterHost<any>) {}
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SecurityMiddleware, VersionMiddleware)
            .forRoutes('*')
            .apply(TouriiOnchainApiMiddleware)
            .forRoutes('*');
    }
}
