import { ContextStorage } from '@app/core/support/context/context-storage';
// biome-ignore lint/style/useImportType: <explanation>
import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { TouriiBackendContextProvider } from './context/tourii-backend-context-provider';

/**
 * Middleware for Tourii Backend API requests
 * Handles context creation, request logging, and sanitizing sensitive data
 */
@Injectable()
export class TouriiBackendApiMiddleware implements NestMiddleware {
    //
    protected context: TouriiBackendContextProvider;

    // Headers that should be redacted from logs
    private readonly sensitiveHeaders = [
        'x-api-key',
        'api-key',
        'apikey',
        'authorization',
        'accept-version',
        'cookie',
    ];

    constructor(private readonly logger: Logger) {}

    /**
     * @implements
     */
    use(req: Request, _res: Response, next: NextFunction) {
        //
        this.context = new TouriiBackendContextProvider(req);

        // Sanitize headers before logging
        const sanitizedHeaders = this.sanitizeHeaders(req.headers);

        const additionalInfo: {
            Headers: Record<string, string | string[] | undefined>;
            Params?: Record<string, string>;
            Body?: unknown;
            Query?: Record<string, string | string[]>;
        } = {
            Headers: sanitizedHeaders,
            ...(req.params &&
                Object.keys(req.params).length > 0 && {
                    Params: req.params,
                }),
            ...(req.body &&
                Object.keys(req.body).length > 0 && {
                    Body: req.body,
                }),
            ...(req.query &&
                Object.keys(req.query).length > 0 && {
                    Query: req.query,
                }),
        };

        // RequestLog出力
        if (req.headers['user-agent'] !== 'ELB-HealthChecker/2.0') {
            // ELBのヘルスチェックリクエストはログ出力しない
            this.logger.log(JSON.stringify(additionalInfo), this.context.getRequestId());
        }

        // Store context and continue middleware chain
        ContextStorage.run(this.context, () => {
            next();
        });
    }

    /**
     * Sanitizes headers by redacting sensitive information
     * @param headers The request headers
     * @returns Sanitized headers
     */
    private sanitizeHeaders(
        headers: Record<string, string | string[] | undefined>,
    ): Record<string, string | string[] | undefined> {
        const sanitized = { ...headers };

        // Redact sensitive headers
        this.sensitiveHeaders.forEach((header) => {
            if (sanitized[header]) {
                sanitized[header] = '**REDACTED**';
            }
        });

        return sanitized;
    }
}
