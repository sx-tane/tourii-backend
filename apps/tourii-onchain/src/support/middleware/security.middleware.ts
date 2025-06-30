import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cors from 'cors';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { TouriiOnchainAppErrorType } from '../exception/tourii-onchain-app-error-type';
import { TouriiOnchainAppException } from '../exception/tourii-onchain-app-exception';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    use(req: Request, res: Response, next: NextFunction) {
        try {
            // 1. API Key Validation
            const apiKey = req.header('x-api-key');
            const validApiKeys = this.configService.get<string>('API_KEYS')?.split(',') || [];

            if (!apiKey) {
                throw new TouriiOnchainAppException(TouriiOnchainAppErrorType.E_OC_010);
            }

            if (!validApiKeys.includes(apiKey)) {
                throw new TouriiOnchainAppException(TouriiOnchainAppErrorType.E_OC_011);
            }

            // Apply Helmet for security headers
            helmet()(req, res, () => {
                // Apply CORS
                const allowedOrigin = this.configService.get('CORS_ORIGIN', 'https://*.tourii.xyz');

                const corsOptions = {
                    origin: allowedOrigin,
                    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                    allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
                    credentials: true,
                };

                cors(corsOptions)(req, res, next);
            });
        } catch (error) {
            next(error);
        }
    }
}
