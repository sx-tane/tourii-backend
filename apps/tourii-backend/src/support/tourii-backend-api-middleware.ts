import { ContextStorage } from '@app/core/support/context/context-storage';
import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { TouriiBackendContextProvider } from './context/tourii-backend-context-provider';

/**
 *
 */
@Injectable()
export class TouriiBackendApiMiddleware implements NestMiddleware {
  //
  protected context: TouriiBackendContextProvider;

  constructor(private readonly logger: Logger) {}

  /**
   * @implements
   */
  use(req: Request, _res: Response, next: NextFunction) {
    //
    this.context = new TouriiBackendContextProvider(req);

    const additionalInfo: Record<string, any> = {
      Headers: req.headers,
      ...(req.params &&
        Object.keys(req.params).length > 0 && { Params: req.params }),
      ...(req.body && Object.keys(req.body).length > 0 && { Body: req.body }),
      ...(req.query &&
        Object.keys(req.query).length > 0 && { Query: req.query }),
    };

    // RequestLog出力
    if (req.headers['user-agent'] !== 'ELB-HealthChecker/2.0') {
      // ELBのヘルスチェックリクエストはログ出力しない
      this.logger.log(
        JSON.stringify(additionalInfo),
        this.context.getRequestId(),
      );
    }

    // RequestスコープStorageへContextを保存
    ContextStorage.run(this.context, next, 'route');
  }
}
