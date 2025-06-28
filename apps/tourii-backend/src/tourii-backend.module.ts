import { AiContentGeneratorService } from '@app/core/infrastructure/ai-route/ai-content-generator.service';
import { GeoInfoRepositoryApi } from '@app/core/infrastructure/api/geo-info-repository-api';
import { LocationInfoRepositoryApi } from '@app/core/infrastructure/api/location-info-repository-api';
import { WeatherInfoRepositoryApi } from '@app/core/infrastructure/api/weather-info.repository-api';
import { EncryptionRepositoryAuth } from '@app/core/infrastructure/authentication/encryption-repository-auth';
import { JwtRepositoryAuth } from '@app/core/infrastructure/authentication/jwt-repository-auth';
import { DigitalPassportRepositoryFake } from '@app/core/infrastructure/blockchain/digital-passport.repository.fake';
import { GroupQuestRepositoryDb } from '@app/core/infrastructure/datasource/group-quest.repository-db';
import { ModelRouteRepositoryDb } from '@app/core/infrastructure/datasource/model-route-repository-db';
import { MomentRepositoryDb } from '@app/core/infrastructure/datasource/moment.repository-db';
import { QuestRepositoryDb } from '@app/core/infrastructure/datasource/quest-repository-db';
import { StoryRepositoryDb } from '@app/core/infrastructure/datasource/story-repository-db';
import { TaskRepositoryDb } from '@app/core/infrastructure/datasource/task-repository-db';
import { UserRepositoryDb } from '@app/core/infrastructure/datasource/user-repository-db';
import { UserStoryLogRepositoryDb } from '@app/core/infrastructure/datasource/user-story-log.repository-db';
import { UserTaskLogRepositoryDb } from '@app/core/infrastructure/datasource/user-task-log.repository-db';
import { UserTravelLogRepositoryDb } from '@app/core/infrastructure/datasource/user-travel-log.repository-db';
import { LocationTrackingServiceImpl } from '@app/core/infrastructure/location/location-tracking.service-impl';
import { AppleWalletRepositoryApi } from '@app/core/infrastructure/passport/apple-wallet.repository-api';
import { GoogleWalletRepositoryApi } from '@app/core/infrastructure/passport/google-wallet.repository-api';
import { MockPassportDataService } from '@app/core/infrastructure/passport/mock-passport-data.service';
import { PassportMetadataRepositoryImpl } from '@app/core/infrastructure/passport/passport-metadata.repository-impl';
import { PassportPdfRepositoryImpl } from '@app/core/infrastructure/passport/passport-pdf.repository-impl';
import { WalletPassRepositoryImpl } from '@app/core/infrastructure/passport/wallet-pass.repository-impl';
import { R2StorageRepositoryS3 } from '@app/core/infrastructure/storage/r2-storage.repository-s3';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { TouriiBackendLoggingService } from '@app/core/provider/tourii-backend-logging-service';
import { getEnv } from '@app/core/utils/env-utils';
import { HttpModule } from '@nestjs/axios';
import { CacheModule } from '@nestjs/cache-manager';
import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE, HttpAdapterHost } from '@nestjs/core';
import {
    ThrottlerGuard,
    ThrottlerModule,
    ThrottlerModuleOptions,
    ThrottlerStorageService,
} from '@nestjs/throttler';
import { redisStore } from 'cache-manager-redis-store';
import { ZodValidationPipe } from 'nestjs-zod';
import { PassportMetadataService } from '../../tourii-onchain/src/service/passport-metadata.service';
import { TestController } from './controller/test.controller';
import { TouriiBackendController } from './controller/tourii-backend.controller';
import { GroupQuestGateway } from './group-quest/group-quest.gateway';
import { AiRouteRecommendationService } from './service/ai-route-recommendation.service';
import { RouteFilterService } from './service/route-filter.service';
import { TouriiBackendService } from './service/tourii-backend.service';
import { TouriiBackendContextProvider } from './support/context/tourii-backend-context-provider';
import { SecurityMiddleware } from './support/middleware/security.middleware';
import { TouriiBackendApiMiddleware } from './support/tourii-backend-api-middleware';
import { TouriiBackendConstants } from './tourii-backend.constant';

/**
 * Main module for the Tourii Backend application
 * Configures:
 * 1. Global rate limiting
 * 2. Security middleware
 * 3. API middleware
 * 4. Dependency injection
 */
@Module({
    imports: [
        // HTTP module for making external requests
        HttpModule,

        // Global configuration module
        ConfigModule.forRoot({
            isGlobal: true, // Make config available everywhere
            envFilePath: `.env.${getEnv({ key: 'NODE_ENV', defaultValue: '' })}`, // Load environment-specific config
        }),

        // Rate limiting configuration
        ThrottlerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
                throttlers: [
                    {
                        ttl: config.get<number>('THROTTLE_TTL') ?? 1000, // Time window: 1 second
                        limit: config.get<number>('THROTTLE_LIMIT') ?? 3, // Allow 3 requests per window
                    },
                ],
                storage: new ThrottlerStorageService(), // Store rate limit data in memory
            }),
        }),

        // Redis Cache Configuration
        CacheModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                store: redisStore,
                host: configService.get<string>('REDIS_HOST', 'localhost'),
                port: configService.get<number>('REDIS_PORT', 6379),
                ttl: configService.get<number>('CACHE_TTL', 3600),
                // password: configService.get<string>('REDIS_PASSWORD'), // Uncomment if needed
            }),
            isGlobal: true, // Make CacheModule available globally
        }),
    ],
    // Register controllers that handle HTTP requests
    controllers: [TouriiBackendController, TestController],
    // Register services and providers
    providers: [
        Logger, // Logging service
        ConfigService, // Configuration service
        PrismaService, // Database service
        TouriiBackendLoggingService, // Custom logging
        TouriiBackendService, // Main business logic
        TouriiBackendHttpService, // HTTP client service
        AiRouteRecommendationService, // AI route recommendation service
        RouteFilterService, // Optimized route filtering service
        AiContentGeneratorService, // AI content generation service
        GroupQuestGateway,
        CachingService,
        // Passport metadata service (onchain)
        PassportMetadataService,
        HttpAdapterHost, // HTTP adapter
        {
            provide: TouriiBackendConstants.USER_STORY_LOG_REPOSITORY_TOKEN,
            useClass: UserStoryLogRepositoryDb,
        },
        {
            provide: TouriiBackendConstants.GROUP_QUEST_REPOSITORY_TOKEN,
            useClass: GroupQuestRepositoryDb,
        },
        {
            provide: TouriiBackendConstants.MOMENT_REPOSITORY_TOKEN,
            useClass: MomentRepositoryDb,
        },
        {
            provide: TouriiBackendConstants.USER_TASK_LOG_REPOSITORY_TOKEN,
            useClass: UserTaskLogRepositoryDb,
        },
        {
            provide: TouriiBackendConstants.USER_TRAVEL_LOG_REPOSITORY_TOKEN,
            useClass: UserTravelLogRepositoryDb,
        },
        {
            provide: TouriiBackendConstants.R2_STORAGE_REPOSITORY_TOKEN,
            useClass: R2StorageRepositoryS3,
        },
        {
            provide: TouriiBackendConstants.CONTEXT_PROVIDER_TOKEN,
            useClass: TouriiBackendContextProvider,
        },
        {
            provide: TouriiBackendConstants.DIGITAL_PASSPORT_REPOSITORY_TOKEN,
            useClass: DigitalPassportRepositoryFake,
        },
        {
            provide: TouriiBackendConstants.USER_REPOSITORY_TOKEN,
            useClass: UserRepositoryDb, // User database access
        },
        {
            provide: TouriiBackendConstants.STORY_REPOSITORY_TOKEN,
            useClass: StoryRepositoryDb, // Story database access
        },
        {
            provide: TouriiBackendConstants.MODEL_ROUTE_REPOSITORY_TOKEN,
            useClass: ModelRouteRepositoryDb, // Model route database access
        },
        {
            provide: TouriiBackendConstants.QUEST_REPOSITORY_TOKEN,
            useClass: QuestRepositoryDb, // Quest database access
        },
        {
            provide: TouriiBackendConstants.GEO_INFO_REPOSITORY_TOKEN,
            useClass: GeoInfoRepositoryApi, // Geo info database access
        },
        {
            provide: TouriiBackendConstants.WEATHER_INFO_REPOSITORY_TOKEN,
            useClass: WeatherInfoRepositoryApi, // Weather info database access
        },
        {
            provide: TouriiBackendConstants.LOCATION_INFO_REPOSITORY_TOKEN,
            useClass: LocationInfoRepositoryApi,
        },
        {
            provide: TouriiBackendConstants.ENCRYPTION_REPOSITORY_TOKEN,
            useClass: EncryptionRepositoryAuth,
        },
        {
            provide: TouriiBackendConstants.LOCATION_TRACKING_SERVICE_TOKEN,
            useClass: LocationTrackingServiceImpl,
        },
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe, // Request validation
        },
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard, // Global rate limiting
        },
        {
            provide: TouriiBackendConstants.TASK_REPOSITORY_TOKEN,
            useClass: TaskRepositoryDb,
        },
        // New passport repositories
        {
            provide: TouriiBackendConstants.PASSPORT_PDF_REPOSITORY_TOKEN,
            useClass: PassportPdfRepositoryImpl,
        },
        {
            provide: TouriiBackendConstants.WALLET_PASS_REPOSITORY_TOKEN,
            useClass: WalletPassRepositoryImpl,
        },
        {
            provide: TouriiBackendConstants.JWT_REPOSITORY_TOKEN,
            useClass: JwtRepositoryAuth,
        },
        {
            provide: TouriiBackendConstants.PASSPORT_METADATA_REPOSITORY_TOKEN,
            useClass: PassportMetadataRepositoryImpl,
        },
        {
            provide: TouriiBackendConstants.APPLE_WALLET_REPOSITORY_TOKEN,
            useClass: AppleWalletRepositoryApi,
        },
        {
            provide: TouriiBackendConstants.GOOGLE_WALLET_REPOSITORY_TOKEN,
            useClass: GoogleWalletRepositoryApi,
        },
        {
            provide: TouriiBackendConstants.MOCK_PASSPORT_DATA_SERVICE_TOKEN,
            useClass: MockPassportDataService,
        },
    ],
})
export class TouriiBackendModule implements NestModule {
    constructor(private readonly refHost: HttpAdapterHost) {}

    /**
     * Configure middleware pipeline
     * Order is important! Security middleware must run first
     */
    configure(consumer: MiddlewareConsumer) {
        consumer
            // Step 1: Apply security middleware (CORS, headers, etc)
            .apply(SecurityMiddleware)
            .forRoutes('*')
            // Step 2: Apply API middleware (logging, context, etc)
            .apply(TouriiBackendApiMiddleware)
            .forRoutes('*');
    }
}
