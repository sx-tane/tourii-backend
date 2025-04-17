import type { ContextProvider } from '@app/core/support/context/context.provider';
import { RequestId } from '@app/core/support/context/request-id';
import { DateUtils } from '@app/core/utils/date-utils';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';

/**
 * webコネクト予約記録APIContext
 */
@Injectable({ scope: Scope.REQUEST })
export class TouriiBackendContextProvider implements ContextProvider {
  protected requestId: RequestId;
  protected systemDateTime: Date;

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
    this.systemDateTime = DateUtils.getJSTDate();
  }
  getSystemDateTimeJST(): Date {
    return this.systemDateTime;
  }

  /**
   * @implements
   */
  getRequestId(): RequestId {
    return this.requestId;
  }
}
