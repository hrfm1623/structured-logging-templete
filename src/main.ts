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
    console.log('Starting application...');
    console.log('Environment:', {
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
      LOG_LEVEL: process.env.LOG_LEVEL,
      USE_JSON_LOGGER: process.env.USE_JSON_LOGGER,
      GOOGLE_CLOUD_PROJECT_ID: process.env.GOOGLE_CLOUD_PROJECT_ID,
    });

    // ロガーの初期設定
    const loggerConfig = {
      level: (process.env.LOG_LEVEL as LogLevel) || 'info',
      useJson: process.env.USE_JSON_LOGGER === 'true',
    };

    console.log('Logger config:', loggerConfig);

    const logger = LoggerModule.forRoot(loggerConfig);
    console.log('Logger module initialized');

    const loggerProvider = logger.providers.find(
      (p) => (p as LoggerProvider).provide === 'LOGGER',
    ) as LoggerProvider;

    if (!loggerProvider) {
      throw new Error('Logger provider not found');
    }

    console.log('Creating NestJS application...');
    const app = await NestFactory.create(AppModule, {
      logger: loggerProvider.useValue,
    });

    // グローバル設定
    app.setGlobalPrefix('api');
    app.enableCors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });
    console.log('Global settings configured');

    // Cloud Run用のヘルスチェックエンドポイントを追加（プレフィックスなし）
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/_ah/warmup', (_, res) => {
      res.send('OK');
    });
    httpAdapter.get('/health', (_, res) => {
      res.send('OK');
    });
    console.log('Health check endpoints added');

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 8080);
    console.log(`Port configured: ${port}`);

    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    console.error('Failed to start application:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
    }
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
