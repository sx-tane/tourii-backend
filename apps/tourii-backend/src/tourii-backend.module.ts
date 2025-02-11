import { UserRepositoryDb } from '@app/core/infrastructure/datasource/user-repository-db';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { TouriiBackendLoggingService } from '@app/core/provider/tourii-backend-logging-service';
import { getEnv } from '@app/core/utils/env-utils';
import { HttpModule } from '@nestjs/axios';
import {
  Logger,
  type MiddlewareConsumer,
  Module,
  type NestModule
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE, HttpAdapterHost } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { TouriiBackendController } from './controller/tourii-backend.controller';
import { TouriiBackendService } from './service/tourii-backend.service';
import { TouriiBackendContextProvider } from './support/context/tourii-backend-context-provider';
import { TouriiBackendApiMiddleware } from './support/tourii-backend-api-middleware';
import { TouriiBackendConstants } from './tourii-backend.constant';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: `.env.${getEnv({ key: 'NODE_ENV', defaultValue: '' })}`,
    }),
  ],
  controllers: [TouriiBackendController],
  providers: [
    Logger,
    PrismaService,
    TouriiBackendLoggingService,
    TouriiBackendService,
    TouriiBackendHttpService,
    HttpAdapterHost,
    {
      provide: TouriiBackendConstants.CONTEXT_PROVIDER_TOKEN,
      useClass: TouriiBackendContextProvider,
    },
    {
      provide: TouriiBackendConstants.USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryDb,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class TouriiBackendModule implements NestModule {
  constructor(private readonly refHost: HttpAdapterHost<any>) {}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TouriiBackendApiMiddleware).forRoutes('*');
  }
}
