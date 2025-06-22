import fs from 'node:fs';
import { getEnv, TouriiCoreLoggingService } from '@app/core';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import { Request, Response } from 'express';
import { patchNestJsSwagger } from 'nestjs-zod';
import { TouriiBackendModule } from './tourii-backend.module';

let app: NestExpressApplication;

async function createApp(): Promise<NestExpressApplication> {
    if (app) {
        return app;
    }

    app = await NestFactory.create<NestExpressApplication>(TouriiBackendModule, {
        logger: new TouriiCoreLoggingService('debug'),
    });

    app.use(compression());
    app.use(
        bodyParser.json({
            limit: '1mb',
        }),
    );
    app.use(
        bodyParser.urlencoded({
            limit: '1mb',
            extended: true,
        }),
    );

    // CORS is handled by SecurityMiddleware - do not enable here to avoid security bypass

    if (
        getEnv({
            key: 'EXPORT_OPENAPI_JSON',
            defaultValue: 'false',
        }) === 'true'
    ) {
        const config = new DocumentBuilder()
            .setTitle('Tourii Backend API')
            .setDescription('Tourii Backend API Def')
            .setVersion('1.0.0')
            .addTag('v1.0.0')
            .build();

        patchNestJsSwagger();
        const documentFactory = () =>
            SwaggerModule.createDocument(app, config, {
                autoTagControllers: false,
            });

        // Only write file in local development, not in serverless
        if (getEnv({ key: 'NODE_ENV', defaultValue: 'dev' }) !== 'production') {
            try {
                fs.writeFileSync(
                    './etc/openapi/openapi.json',
                    JSON.stringify(documentFactory(), null, 2),
                );
            } catch (error) {
                console.warn('Could not write OpenAPI JSON file:', error);
            }
        }
        SwaggerModule.setup('api/docs', app, documentFactory);
    }

    await app.init();
    return app;
}

// For local development
async function bootstrap() {
    const nestApp = await createApp();
    const port = getEnv({
        key: 'TOURII_BACKEND_PORT',
        defaultValue: '3000',
    });
    await nestApp.listen(port);
    const logger = new TouriiCoreLoggingService('bootstrap');
    logger.log(`🚀 Tourii Backend running on port ${port}`);
}

// Export for Vercel serverless
export default async (req: Request, res: Response) => {
    const nestApp = await createApp();
    const expressInstance = nestApp.getHttpAdapter().getInstance();
    return expressInstance(req, res);
};

// Start the app locally if not in serverless environment
if (require.main === module) {
    bootstrap();
}
