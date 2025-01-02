import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerModule } from './common/logger/logger.module';
import { LogLevel } from './common/logger/logger.interface';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';
import * as net from 'net';

interface LoggerProvider {
  provide: string;
  useValue: LoggerService;
}

async function waitForPort(port: number, host: string): Promise<void> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.unref();
    server.on('error', () => {
      setTimeout(() => {
        waitForPort(port, host).then(resolve);
      }, 1000);
    });
    server.listen(port, host, () => {
      server.close(() => resolve());
    });
  });
}

async function bootstrap() {
  try {
    console.log('Starting application...');

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

    console.log('Logger config:', { ...loggerConfig, credentials: '***' });

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

    // Cloud Run用のヘルスチェックエンドポイントを追加
    app.getHttpAdapter().get('/_ah/warmup', (_, res) => {
      res.send('OK');
    });
    console.log('Health check endpoint added');

    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 8080);
    console.log(`Port configured: ${port}`);

    // ポートが利用可能になるまで待機
    await waitForPort(port, '0.0.0.0');
    console.log(`Port ${port} is available`);

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
