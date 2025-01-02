import { LoggerConfig } from './logger.interface';
import { LoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import * as winston from 'winston';

export class LoggerFactory {
  public static createLogger(config: LoggerConfig): LoggerService {
    try {
      console.log('Creating logger with config:', {
        ...config,
        credentials: config.credentials ? '***' : undefined,
      });

      const transports: winston.transport[] = [
        new winston.transports.Console({
          format: config.useJson
            ? winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
              )
            : winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.simple(),
              ),
        }),
      ];

      // Cloud Run環境の場合は自動的にCloud Loggingを追加
      if (process.env.K_SERVICE) {
        console.log(
          'Detected Cloud Run environment, adding Cloud Logging transport',
        );
        const loggingWinston = new LoggingWinston();
        transports.push(loggingWinston);
      }
      // 明示的な認証情報がある場合はそちらを使用
      else if (config.projectId && config.credentials) {
        console.log('Using explicit credentials for Cloud Logging');
        const loggingWinston = new LoggingWinston({
          projectId: config.projectId,
          credentials: {
            client_email: config.credentials.clientEmail,
            private_key: config.credentials.privateKey,
          },
        });
        transports.push(loggingWinston);
      }

      const logger = WinstonModule.createLogger({
        level: config.level,
        transports,
      });

      console.log('Logger created successfully');
      return logger;
    } catch (error) {
      console.error('Failed to create logger:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name,
        });
      }
      // フォールバックとしてコンソールのみのロガーを返す
      return WinstonModule.createLogger({
        level: config.level,
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.json(),
            ),
          }),
        ],
      });
    }
  }
}
