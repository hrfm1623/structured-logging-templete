export type LogLevel =
  | 'error'
  | 'warn'
  | 'info'
  | 'http'
  | 'verbose'
  | 'debug'
  | 'silly';

export interface LoggerConfig {
  readonly level: LogLevel;
  readonly useJson: boolean;
  readonly projectId?: string;
  readonly credentials?: {
    readonly clientEmail: string;
    readonly privateKey: string;
  };
}

export interface StructuredLog {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly message: string;
  readonly context?: string;
  readonly requestId?: string;
  readonly [key: string]: unknown;
}
