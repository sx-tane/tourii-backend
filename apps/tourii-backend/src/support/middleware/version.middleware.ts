import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '@nestjs/config';
import semver from 'semver';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';

@Injectable()
export class VersionMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, _res: Response, next: NextFunction) {
    const version = req.header('accept-version');
    const currentVersion = this.configService.get<string>('API_VERSION', '1.0.0');

    if (!version) {
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_020);
    }

    if (!semver.valid(version)) {
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_021);
    }

    if (semver.lt(version, currentVersion)) {
      throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_022);
    }

    next();
  }
}