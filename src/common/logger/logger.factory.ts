import { LoggerConfig } from './logger.interface';
import { LoggerService } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { LoggingWinston } from '@google-cloud/logging-winston';
import * as winston from 'winston';

export class LoggerFactory {
  public static createLogger(config: LoggerConfig): LoggerService {
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
      const loggingWinston = new LoggingWinston();
      transports.push(loggingWinston);
    }
    // 明示的な認証情報がある場合はそちらを使用
    else if (config.projectId && config.credentials) {
      const loggingWinston = new LoggingWinston({
        projectId: config.projectId,
        credentials: {
          client_email: config.credentials.clientEmail,
          private_key: config.credentials.privateKey,
        },
      });
      transports.push(loggingWinston);
    }

    return WinstonModule.createLogger({
      level: config.level,
      transports,
    });
  }
}
