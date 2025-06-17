import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';
import semver from 'semver';
import { TouriiOnchainAppErrorType } from '../exception/tourii-onchain-app-error-type';
import { TouriiOnchainAppException } from '../exception/tourii-onchain-app-exception';

@Injectable()
export class VersionMiddleware implements NestMiddleware {
    constructor(private readonly configService: ConfigService) {}

    use(req: Request, _res: Response, next: NextFunction) {
        const version = req.header('accept-version');
        const currentVersion = this.configService.get<string>('API_VERSION', '1.0.0');

        if (!version) {
            throw new TouriiOnchainAppException(TouriiOnchainAppErrorType.E_OC_003);
        }

        if (!semver.valid(version)) {
            throw new TouriiOnchainAppException(TouriiOnchainAppErrorType.E_OC_004);
        }

        if (semver.lt(version, currentVersion)) {
            throw new TouriiOnchainAppException(TouriiOnchainAppErrorType.E_OC_005);
        }

        next();
    }
}
