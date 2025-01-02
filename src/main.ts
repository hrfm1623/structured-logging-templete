import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerModule } from './common/logger/logger.module';
import { LogLevel } from './common/logger/logger.interface';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  // ロガーの初期設定
  const loggerConfig = {
    level: (process.env.LOG_LEVEL as LogLevel) || 'info',
    useJson: process.env.USE_JSON_LOGGER === 'true',
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    credentials:
      process.env.GOOGLE_CLOUD_CLIENT_EMAIL &&
      process.env.GOOGLE_CLOUD_PRIVATE_KEY
        ? {
            clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
            privateKey: process.env.GOOGLE_CLOUD_PRIVATE_KEY.replace(
              /\\n/g,
              '\n',
            ),
          }
        : undefined,
  };

  const logger = LoggerModule.forRoot(loggerConfig);
  const app = await NestFactory.create(AppModule, {
    logger: logger.providers.find((p) => p.provide === 'LOGGER').useValue,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 8080);

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
