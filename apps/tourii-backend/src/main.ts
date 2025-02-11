import { TouriiCoreLoggingService } from '@app/core/provider/tourii-core-logging-service';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import fs from 'node:fs';
import { TouriiBackendModule } from './tourii-backend.module';

async function bootstrap() {
  const app = await NestFactory.create(TouriiBackendModule, {
    logger: new TouriiCoreLoggingService('debug'),
  });
  const configService = app.get(ConfigService);
  app.use(compression());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

  if (configService.get('EXPORT_OPENAPI_JSON') === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Tourii Backend API')
      .setDescription('Tourii Backend API Def')
      .setVersion('1.0.0')
      .addTag('v1.0.0')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, { autoTagControllers: false });

    fs.writeFileSync(
      './etc/openapi/openapi.json',
      JSON.stringify(documentFactory(), null, 2),
    );
    SwaggerModule.setup('api/docs', app, documentFactory);
  }
  await app.listen(configService.get('TOURII_BACKEND_PORT') || 3000);
}
bootstrap();
