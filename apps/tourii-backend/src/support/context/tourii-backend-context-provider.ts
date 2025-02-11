import type { ContextProvider } from '@app/core/support/context/context.provider';
import { RequestId } from '@app/core/support/context/request-id';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

/**
 * webコネクト予約記録APIContext
 */
@Injectable({ scope: Scope.REQUEST })
export class TouriiBackendContextProvider implements ContextProvider {
  protected requestId: RequestId;

  /**
   * コンストラクタ
   * @param req Request
   */
  constructor(
    @Inject(REQUEST)
    protected readonly req: Request,
  ) {
    // RequestId
    this.requestId = new RequestId();
  }

  /**
   * @implements
   */
  getRequestId(): RequestId {
    return this.requestId;
  }
}
