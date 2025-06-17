import {
    ApiAppError,
    ErrorMetadata,
} from '@app/core/support/exception/tourii-backend-app-exception';
import { HttpException, HttpStatus } from '@nestjs/common';
import { TouriiOnchainAppErrorType } from './tourii-onchain-app-error-type';

export class TouriiOnchainAppException extends HttpException {
    constructor(
        error: TouriiOnchainAppErrorType[keyof TouriiOnchainAppErrorType],
        metadata?: ErrorMetadata,
    ) {
        super(new ApiAppError(error.code, error.message, error.type, metadata), HttpStatus.OK);
    }
}
