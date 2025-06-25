import { JwtRepository, QrCodePayload } from '@app/core/domain/auth/jwt.repository';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';

@Injectable()
export class JwtRepositoryAuth implements JwtRepository {
    private readonly secretKey: string;
    constructor(protected readonly configService: ConfigService) {
        const secret = this.configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_040);
        }
        this.secretKey = secret;
    }

    generateJwtToken<T extends Record<string, unknown>>(
        payload: T,
        options?: jwt.SignOptions,
    ): string {
        return jwt.sign(payload, this.secretKey, options);
    }

    dataFromToken<T = Record<string, unknown>>(token: string): T {
        try {
            return jwt.verify(token, this.secretKey) as T;
        } catch (_error) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_002);
        }
    }

    generateQrToken(tokenId: string, expirationHours = 24): string {
        const now = Math.floor(Date.now() / 1000);
        const expiresAt = now + expirationHours * 60 * 60;

        const payload: QrCodePayload = {
            tokenId,
            type: 'passport_verification',
            issuedAt: now,
            expiresAt,
        };

        return this.generateJwtToken(payload, {
            expiresIn: `${expirationHours}h`,
        });
    }

    verifyQrToken(qrToken: string): QrCodePayload {
        try {
            const payload = this.dataFromToken<QrCodePayload>(qrToken);

            // Validate payload structure
            if (!payload.tokenId || payload.type !== 'passport_verification') {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_045);
            }

            // Check expiration
            const now = Math.floor(Date.now() / 1000);
            if (payload.expiresAt && payload.expiresAt < now) {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_046);
            }

            return payload;
        } catch (error) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_002);
        }
    }
}
