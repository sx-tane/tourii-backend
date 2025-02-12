import { JwtRepository } from '@app/core/domain/auth/jwt.repository';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import { TouriiBackendAppErrorType } from '../../support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '../../support/exception/tourii-backend-app-exception';

@Injectable()
export class JwtRepositoryAuth implements JwtRepository {
  private readonly secretKey: string;
  constructor(protected readonly configService: ConfigService) {
    this.secretKey =
      this.configService.get<string>('JWT_SECRET') || 'defaultSecretKey';
  }

  generateJwtToken(payload: object, options?: jwt.SignOptions): string {
    return jwt.sign(payload, this.secretKey, options);
  }

  dataFromToken(token: string): any {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_002);
    }
  }
}
