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

      const customFormat = winston.format.printf(
        ({ level, message, timestamp, ...metadata }) => {
          const structuredLog = {
            timestamp,
            level,
            message:
              typeof message === 'object' ? JSON.stringify(message) : message,
            ...metadata,
          };
          return JSON.stringify(structuredLog);
        },
      );

      const transports: winston.transport[] = [];

      // Cloud Run環境の場合はCloud Loggingのみを使用
      if (process.env.K_SERVICE) {
        console.log(
          'Detected Cloud Run environment, using Cloud Logging transport',
        );
        const loggingWinston = new LoggingWinston({
          logName: 'winston_log',
          prefix: config.projectId,
          labels: {
            environment: process.env.NODE_ENV || 'development',
          },
        });
        transports.push(loggingWinston);
      } else {
        // 開発環境の場合はコンソール出力を使用
        transports.push(
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize(),
              customFormat,
            ),
          }),
        );
      }

      const logger = WinstonModule.createLogger({
        level: config.level,
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.metadata({
            fillExcept: ['timestamp', 'level', 'message'],
          }),
          customFormat,
        ),
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
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.errors({ stack: true }),
          winston.format.json(),
        ),
        transports: [
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize(),
              winston.format.simple(),
            ),
          }),
        ],
      });
    }
  }
}
