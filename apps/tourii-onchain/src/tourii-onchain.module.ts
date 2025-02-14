import { SailsCallsRepositoryApi } from '@app/core/infrastructure/api/sails-calls-repository-api';
import { EncryptionRepositoryAuth } from '@app/core/infrastructure/authentication/encryption-repository-auth';
import { JwtRepositoryAuth } from '@app/core/infrastructure/authentication/jwt-repository-auth';
import { TouriiBackendLoggingService } from '@app/core/provider/tourii-backend-logging-service';
import { getEnv } from '@app/core/utils/env-utils';
import { HttpModule } from '@nestjs/axios';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpAdapterHost } from '@nestjs/core';
import { TouriiOnchainController } from './controller/tourii-onchain.controller';
import { TouriiOnchainService } from './service/tourii-onchain.service';
import { TouriiOnchainConstants } from './tourii-onchain.constant';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${getEnv({ key: 'NODE_ENV', defaultValue: '' })}`,
    }),
  ],
  controllers: [TouriiOnchainController],
  providers: [
    Logger,
    TouriiBackendLoggingService,
    TouriiOnchainService,
    HttpAdapterHost,
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
  ],
})
export class TouriiOnchainModule implements NestModule {
  constructor(private readonly refHost: HttpAdapterHost<any>) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply().forRoutes('*');
  }
}
