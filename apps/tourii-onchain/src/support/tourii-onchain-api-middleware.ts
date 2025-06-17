import { ContextStorage } from '@app/core/support/context/context-storage';
import type { NestMiddleware } from '@nestjs/common';
import { Injectable, Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { TouriiOnchainContextProvider } from './context/tourii-onchain-context-provider';

@Injectable()
export class TouriiOnchainApiMiddleware implements NestMiddleware {
    protected context: TouriiOnchainContextProvider;

    private readonly sensitiveHeaders = ['x-api-key', 'authorization', 'cookie'];

    constructor(private readonly logger: Logger) {}

    use(req: Request, _res: Response, next: NextFunction) {
        this.context = new TouriiOnchainContextProvider(req);

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

        if (req.headers['user-agent'] !== 'ELB-HealthChecker/2.0') {
            this.logger.log(JSON.stringify(additionalInfo), this.context.getRequestId());
        }

        ContextStorage.run(this.context, () => {
            next();
        });
    }

    private sanitizeHeaders(
        headers: Record<string, string | string[] | undefined>,
    ): Record<string, string | string[] | undefined> {
        const sanitized = { ...headers };

        this.sensitiveHeaders.forEach((header) => {
            if (sanitized[header]) {
                sanitized[header] = '**REDACTED**';
            }
        });

        return sanitized;
    }
}
