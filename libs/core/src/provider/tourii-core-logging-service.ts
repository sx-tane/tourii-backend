// biome-ignore lint/style/useImportType: <explanation>
import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { ContextStorage } from '../support/context/context-storage';
import { RequestId } from '../support/context/request-id';
// import * as winstonDailyRotateFile from 'winston-daily-rotate-file';

/**
 * Logger Service Interface
 */
@Injectable()
export class TouriiCoreLoggingService implements LoggerService {
    // Logger
    protected logger: winston.Logger;

    /**
     * Constructor
     * @param logLevel Log Level
     */
    constructor(private readonly logLevel: string) {
        // custom logging level setting
        const customLevels: winston.config.AbstractConfigSetLevels = {
            data: -1,
            error: 0,
            warn: 1,
            http: 1.5,
            info: 2,
            verbose: 3,
            debug: 4,
            silly: 5,
        };

        // Logger Instance Generation
        const logger = winston.createLogger({
            levels: customLevels,
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY/MM/DD HH:mm:ss.SSS',
                }),
                winston.format.errors({
                    stack: true,
                }),
                winston.format.colorize({
                    colors: {
                        data: 'cyan',
                        error: 'red',
                        warn: 'yellow',
                        http: 'blue',
                        info: 'green',
                        debug: 'grey',
                        verbose: 'white',
                    },
                    all: true,
                }),
                winston.format.printf(
                    ({ level, message, timestamp, type, requestId }) =>
                        `${timestamp} ${level} [${type ? type : 'Nest'}] [${requestId ? requestId : ''}] ${message}`,
                ),
            ),

            transports: [
                new winston.transports.Console({
                    // level: 'info',
                    level: this.logLevel,
                }),
                /*  
        new winstonDailyRotateFile({
          level: this.logLevel,
          datePattern: 'YYYY-MM-DD',
          filename: 'application-%DATE%.log',
          dirname: './etc/logs',
          maxSize: '20m',
          maxFiles: '30d',
        }),
        */
            ],
        });

        this.logger = logger;
    }

    /**
     * @override
     */

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    log(message: string, ...optionalParams: any) {
        if (optionalParams.length === 1 && optionalParams[0] instanceof RequestId) {
            this.requestLog(message, optionalParams[0]);
        } else {
            const additionalInfo =
                optionalParams.length > 0 ? JSON.stringify(optionalParams[0]) : undefined;
            this.logger.log({
                level: 'info',
                requestId: ContextStorage.getStore()?.getRequestId()?.value,
                message: additionalInfo ? `${message}:${additionalInfo}` : `${message}`,
            });
        }
    }

    /**
     * Request Log
     * @param message  Message
     * @param requestId RequestId
     */
    requestLog(message: string, requestId: RequestId) {
        this.logger.log({
            level: 'http',
            type: 'RequestLog',
            requestId: `${requestId.value}`,
            message,
        });
    }

    /**
     * @override
     */
    error(message: string, trace: string) {
        this.logger.log({
            level: 'error',
            requestId: ContextStorage.getStore()?.getRequestId()?.value,
            message: JSON.stringify({
                errorMessage: message,
                stackTrace: trace,
            }),
        });
    }

    /**
     * @override
     */
    warn(message: string) {
        this.logger.log({
            level: 'warn',
            requestId: ContextStorage.getStore()?.getRequestId()?.value,
            message,
        });
    }

    /**
     * @override
     */
    debug(message: string) {
        this.logger.log({
            level: 'debug',
            requestId: ContextStorage.getStore()?.getRequestId()?.value,
            message,
        });
    }

    /**
     * @override
     */
    verbose(message: string) {
        this.logger.log({
            level: 'verbose',
            requestId: ContextStorage.getStore()?.getRequestId()?.value,
            message,
        });
    }
}
