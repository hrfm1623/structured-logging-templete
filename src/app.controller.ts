import { Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggerService } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('LOGGER') private readonly logger: LoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('Hello endpoint was called', 'AppController');
    return this.appService.getHello();
  }

  @Get('log-demo')
  logDemo(@Query('message') message: string = 'Test log message'): string {
    this.logger.error('This is an error log', {
      context: 'AppController',
      additionalInfo: { message, type: 'error' },
    });

    this.logger.warn('This is a warning log', {
      context: 'AppController',
      additionalInfo: { message, type: 'warn' },
    });

    this.logger.log('This is an info log', {
      context: 'AppController',
      additionalInfo: { message, type: 'info' },
    });

    this.logger.verbose('This is a verbose log', {
      context: 'AppController',
      additionalInfo: { message, type: 'verbose' },
    });

    this.logger.debug('This is a debug log', {
      context: 'AppController',
      additionalInfo: { message, type: 'debug' },
    });

    return `Logged message: ${message} at all levels`;
  }
}
