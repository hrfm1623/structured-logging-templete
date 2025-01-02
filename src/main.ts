import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerModule } from './common/logger/logger.module';
import { LogLevel } from './common/logger/logger.interface';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';

interface LoggerProvider {
  provide: string;
  useValue: LoggerService;
}

async function bootstrap() {
  try {
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
    const loggerProvider = logger.providers.find(
      (p) => (p as LoggerProvider).provide === 'LOGGER',
    ) as LoggerProvider;

    if (!loggerProvider) {
      throw new Error('Logger provider not found');
    }

    const app = await NestFactory.create(AppModule, {
      logger: loggerProvider.useValue,
    });

    // Cloud Run用のヘルスチェックエンドポイントを追加
    app.getHttpAdapter().get('/_ah/warmup', (_, res) => {
      res.send('OK');
    });

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 8080);

    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

// エラーハンドリングの追加
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});

bootstrap();
