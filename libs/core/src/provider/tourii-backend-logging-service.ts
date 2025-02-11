import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ContextStorage } from '../support/context/context-storage';
import { TouriiCoreLoggingService } from './tourii-core-logging-service';

@Injectable()
export class TouriiBackendLoggingService extends TouriiCoreLoggingService {
  constructor(protected readonly configService: ConfigService) {
    // Log Level
    const logLevel = configService.get<string>('LOGGING_LEVEL');
    // Logger Instance Generation
    super(logLevel ? logLevel : 'info');
  }

  /**
   * Log a message to the Tourii Backend Log
   * @param message
   */
  TouriiBackendLog(message: string) {
    this.logger.log({
      level: 'data',
      type: 'TouriiBackendLog',
      requestId: ContextStorage.getStore()?.getRequestId().value,
      message,
    });
  }
}
