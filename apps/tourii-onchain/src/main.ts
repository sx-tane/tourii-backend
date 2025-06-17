import { TouriiCoreLoggingService, getEnv } from '@app/core';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import { patchNestJsSwagger } from 'nestjs-zod';
import fs from 'node:fs';
import { ValidationPipe } from './support/pipe/validation.pipe';
import { TouriiOnchainModule } from './tourii-onchain.module';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(TouriiOnchainModule, {
        logger: new TouriiCoreLoggingService('debug'),
    });

    app.use(compression());
    app.use(bodyParser.json({ limit: '1mb' }));
    app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe());

    if (
        getEnv({
            key: 'EXPORT_OPENAPI_JSON',
            defaultValue: 'false',
        }) === 'true'
    ) {
        const config = new DocumentBuilder()
            .setTitle('Tourii Onchain API')
            .setDescription('Tourii Onchain API Def')
            .setVersion('1.0.0')
            .addTag('v1.0.0')
            .build();

        patchNestJsSwagger();
        const document = SwaggerModule.createDocument(app, config);

        // Ensure directory exists
        const dir = './etc/openapi/onchain';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(`${dir}/openapi.json`, JSON.stringify(document, null, 2));

        SwaggerModule.setup('api/docs', app, document);
    }

    const port = getEnv({
        key: 'TOURII_ONCHAIN_PORT',
        defaultValue: '3001',
    });
    await app.listen(port);
    const logger = new TouriiCoreLoggingService('bootstrap');
    logger.log(`🚀 Tourii Onchain running on port ${port}`);
}
bootstrap();
