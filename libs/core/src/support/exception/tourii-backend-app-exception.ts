import { HttpException, HttpStatus } from '@nestjs/common';
import type { AppError } from './app-error';
import type { TouriiBackendAppErrorType } from './tourii-backend-app-error-type';

export class ApiAppError implements AppError {
  constructor(
    public code: string,
    public message: string,
  ) {
    this.code = code;
    this.message = message;
  }
}

export class TouriiBackendAppException extends HttpException {
  constructor(
    error: TouriiBackendAppErrorType[keyof TouriiBackendAppErrorType],
  ) {
    super(new ApiAppError(error.code, error.message), HttpStatus.OK);
  }
}
