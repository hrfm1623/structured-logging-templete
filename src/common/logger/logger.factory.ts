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

    // Google Cloud Loggingの設定が存在する場合は追加
    if (config.projectId && config.credentials) {
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
