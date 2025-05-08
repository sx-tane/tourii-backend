import { TouriiCoreLoggingService } from '@app/core/provider/tourii-core-logging-service';
import { getEnv } from '@app/core/utils/env-utils';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import { patchNestJsSwagger } from 'nestjs-zod';
import fs from 'node:fs';
import { TouriiBackendModule } from './tourii-backend.module';

async function bootstrap() {
    const app = await NestFactory.create(TouriiBackendModule, {
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

        fs.writeFileSync('./etc/openapi/openapi.json', JSON.stringify(documentFactory(), null, 2));
        SwaggerModule.setup('api/docs', app, documentFactory);
    }

    const port = getEnv({
        key: 'TOURII_BACKEND_PORT',
        defaultValue: '3000',
    });
    await app.listen(port);
}
bootstrap();
