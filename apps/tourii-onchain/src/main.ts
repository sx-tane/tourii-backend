import fs from 'node:fs';
import { TouriiCoreLoggingService } from '@app/core/provider/tourii-core-logging-service';
import { getEnv } from '@app/core/utils/env-utils';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import bodyParser from 'body-parser';
import compression from 'compression';
import { TouriiOnchainModule } from './tourii-onchain.module';

async function bootstrap() {
  const app = await NestFactory.create(TouriiOnchainModule, {
    logger: new TouriiCoreLoggingService('debug'),
  });
  app.use(compression());
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

  if (
    getEnv({ key: 'EXPORT_OPENAPI_JSON', defaultValue: 'false' }) === 'true'
  ) {
    const config = new DocumentBuilder()
      .setTitle('Tourii Onchain API')
      .setDescription('Tourii Onchain API Def')
      .setVersion('1.0.0')
      .addTag('v1.0.0')
      .build();
    const documentFactory = () =>
      SwaggerModule.createDocument(app, config, { autoTagControllers: false });

    fs.writeFileSync(
      './etc/openapi/openapi-onchain.json',
      JSON.stringify(documentFactory(), null, 2),
    );
    SwaggerModule.setup('api/docs', app, documentFactory);
  }
  await app.listen(getEnv({ key: 'TOURII_ONCHAIN_PORT' }) || 3001);

  process.on('SIGINT', async () => {
    Logger.log('Closing server...');
    // Disconnect from vara network
    await app.get('sailscalls').disconnectGearApi();
    // Close the server
    await app.close();
  });
}
bootstrap();
