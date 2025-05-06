import type { INestApplication } from '@nestjs/common';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { SecurityMiddleware } from '../src/support/middleware/security.middleware';
import { VersionMiddleware } from '../src/support/middleware/version.middleware';
import { TouriiBackendModule } from '../src/tourii-backend.module';
import { HttpExceptionFilter } from './http-exception.filter';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            ignoreEnvFile: true,
        }),
    ],
    providers: [SecurityMiddleware, VersionMiddleware],
})
class TestModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(SecurityMiddleware).forRoutes('*').apply(VersionMiddleware).forRoutes('*');
    }
}

describe('AppController (e2e)', () => {
    let app: INestApplication;
    const TEST_API_KEY = 'test-api-key';
    const TEST_API_VERSION = '1.0.0';

    beforeEach(async () => {
        // Set environment variables before creating the module
        // biome-ignore lint/complexity/useLiteralKeys: needed for type safety
        process.env['API_KEYS'] = TEST_API_KEY;
        // biome-ignore lint/complexity/useLiteralKeys: needed for type safety
        process.env['API_VERSION'] = TEST_API_VERSION;
        // biome-ignore lint/complexity/useLiteralKeys: needed for type safety
        process.env['CORS_ORIGIN'] = 'https://*.tourii.xyz';

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [TestModule, TouriiBackendModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        // Apply the global exception filter
        app.useGlobalFilters(new HttpExceptionFilter());

        await app.init();
    });

    afterEach(() => {
        // Clean up environment variables
        // biome-ignore lint/complexity/useLiteralKeys: needed for type safety
        process.env['API_KEYS'] = undefined;
        // biome-ignore lint/complexity/useLiteralKeys: needed for type safety
        process.env['API_VERSION'] = undefined;
        // biome-ignore lint/complexity/useLiteralKeys: needed for type safety
        process.env['CORS_ORIGIN'] = undefined;
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Health Check', () => {
        it('should return OK with valid headers', () => {
            return request(app.getHttpServer())
                .get('/health-check')
                .set({
                    'x-api-key': TEST_API_KEY,
                    'accept-version': TEST_API_VERSION,
                })
                .expect(200)
                .expect('OK');
        });

        it('should fail without API key', () => {
            return request(app.getHttpServer())
                .get('/health-check')
                .set({
                    'accept-version': TEST_API_VERSION,
                })
                .expect(401);
        });

        it('should fail without version', () => {
            return request(app.getHttpServer())
                .get('/health-check')
                .set({
                    'x-api-key': TEST_API_KEY,
                })
                .expect(401);
        });

        it('should fail with invalid API key', () => {
            return request(app.getHttpServer())
                .get('/health-check')
                .set({
                    'x-api-key': 'invalid-key',
                    'accept-version': TEST_API_VERSION,
                })
                .expect(401);
        });

        it('should fail with invalid version', () => {
            return request(app.getHttpServer())
                .get('/health-check')
                .set({
                    'x-api-key': TEST_API_KEY,
                    'accept-version': 'invalid',
                })
                .expect(401);
        });

        it('should fail with old version', () => {
            return request(app.getHttpServer())
                .get('/health-check')
                .set({
                    'x-api-key': TEST_API_KEY,
                    'accept-version': '0.9.0',
                })
                .expect(401);
        });
    });
});
