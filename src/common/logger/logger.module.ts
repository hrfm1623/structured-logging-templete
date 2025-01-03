import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerConfig } from './logger.interface';
import { LoggerFactory } from './logger.factory';

@Global()
@Module({})
export class LoggerModule {
  public static forRoot(config: LoggerConfig): DynamicModule {
    const logger = LoggerFactory.createLogger(config);

    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'LOGGER_CONFIG',
          useValue: config,
        },
        {
          provide: 'LOGGER',
          useValue: logger,
        },
      ],
      exports: ['LOGGER', 'LOGGER_CONFIG'],
      global: true,
    };
  }
}
