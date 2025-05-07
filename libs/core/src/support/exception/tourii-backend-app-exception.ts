import { HttpException, HttpStatus } from '@nestjs/common';
import type { AppError } from './app-error';
import type { ErrorType } from './error-type';
import type { TouriiBackendAppErrorType } from './tourii-backend-app-error-type';

export interface ErrorMetadata {
    apiKey?: { valid: boolean };
    statusCode?: number;
}

export class ApiAppError implements AppError {
    public metadata: ErrorMetadata;
    public type: ErrorType;

    constructor(
        public code: string,
        public message: string,
        type: ErrorType,
        metadata: ErrorMetadata = {},
    ) {
        this.code = code;
        this.message = message;
        this.type = type;
        this.metadata = metadata;
    }
}

export class TouriiBackendAppException extends HttpException {
    constructor(
        error: TouriiBackendAppErrorType[keyof TouriiBackendAppErrorType],
        metadata?: ErrorMetadata,
    ) {
        super(new ApiAppError(error.code, error.message, error.type, metadata), HttpStatus.OK);
    }
}
