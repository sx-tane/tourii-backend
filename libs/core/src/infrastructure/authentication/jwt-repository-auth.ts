import { JwtRepository } from '@app/core/domain/auth/jwt.repository';
import { JWTData } from '@app/tourii-onchain/service/dto/jwt-dto';
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
            throw new Error('JWT_SECRET environment variable is required for security');
        }
        this.secretKey = secret;
    }

    generateJwtToken<T extends Record<string, unknown>>(payload: T, options?: jwt.SignOptions): string {
        return jwt.sign(payload, this.secretKey, options);
    }

    dataFromToken<T = Record<string, unknown>>(token: string): T {
        try {
            return jwt.verify(token, this.secretKey) as T;
        } catch (_error) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_002);
        }
    }
}
