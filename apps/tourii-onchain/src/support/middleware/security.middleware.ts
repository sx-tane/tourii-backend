import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import cors from 'cors';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';

@Injectable()
export class SecurityMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    use(req: Request, res: Response, next: NextFunction) {
        try {
            // 1. API Key Validation
            const apiKey = req.header('x-api-key');
            const validApiKeys = this.configService.get<string>('API_KEYS')?.split(',') || [];

            if (!apiKey || !validApiKeys.includes(apiKey)) {
                throw new UnauthorizedException('Invalid or missing API key');
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
