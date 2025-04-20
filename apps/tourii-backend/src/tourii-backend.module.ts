import { UserRepositoryDb } from "@app/core/infrastructure/datasource/user-repository-db";
import { PrismaService } from "@app/core/provider/prisma.service";
import { TouriiBackendHttpService } from "@app/core/provider/tourii-backend-http-service";
import { TouriiBackendLoggingService } from "@app/core/provider/tourii-backend-logging-service";
import { getEnv } from "@app/core/utils/env-utils";
import { HttpModule } from "@nestjs/axios";
// biome-ignore lint/style/useImportType: <explanation>
import { Logger, MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD, APP_PIPE, HttpAdapterHost } from "@nestjs/core";
// biome-ignore lint/style/useImportType: cannot use type import here
import {
	ThrottlerGuard,
	ThrottlerModule,
	ThrottlerModuleOptions,
	ThrottlerStorageService,
} from "@nestjs/throttler";
import { ZodValidationPipe } from "nestjs-zod";
import { TestController } from "./controller/test.controller";
import { TouriiBackendController } from "./controller/tourii-backend.controller";
import { TouriiBackendService } from "./service/tourii-backend.service";
import { TouriiBackendContextProvider } from "./support/context/tourii-backend-context-provider";
import { SecurityMiddleware } from "./support/middleware/security.middleware";
import { TouriiBackendApiMiddleware } from "./support/tourii-backend-api-middleware";
import { TouriiBackendConstants } from "./tourii-backend.constant";
import { StoryRepositoryDb } from "@app/core/infrastructure/datasource/story-repository-db";

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
			envFilePath: `.env.${getEnv({ key: "NODE_ENV", defaultValue: "" })}`, // Load environment-specific config
		}),

		// Rate limiting configuration
		ThrottlerModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (config: ConfigService): ThrottlerModuleOptions => ({
				throttlers: [
					{
						ttl: config.get<number>("THROTTLE_TTL") ?? 1000, // Time window: 1 second
						limit: config.get<number>("THROTTLE_LIMIT") ?? 3, // Allow 3 requests per window
					},
				],
				storage: new ThrottlerStorageService(), // Store rate limit data in memory
			}),
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
		HttpAdapterHost, // HTTP adapter
		{
			provide: TouriiBackendConstants.CONTEXT_PROVIDER_TOKEN,
			useClass: TouriiBackendContextProvider, // Request context
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
			provide: APP_PIPE,
			useClass: ZodValidationPipe, // Request validation
		},
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard, // Global rate limiting
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
			.forRoutes("*")
			// Step 2: Apply API middleware (logging, context, etc)
			.apply(TouriiBackendApiMiddleware)
			.forRoutes("*");
	}
}
