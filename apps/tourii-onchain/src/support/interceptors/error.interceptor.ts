import {
    ApiAppError,
    ErrorMetadata,
} from '@app/core/support/exception/tourii-backend-app-exception';
import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TouriiOnchainAppErrorType } from '../exception/tourii-onchain-app-error-type';
import { TouriiOnchainAppException } from '../exception/tourii-onchain-app-exception';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
    intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            catchError((error) => {
                const defaultError = TouriiOnchainAppErrorType.E_OC_002;
                const metadata: ErrorMetadata = {};

                if (error.response?.statusCode === 410 || error.metadata?.statusCode === 410) {
                    metadata.statusCode = 410;
                }

                let errorResponse: ApiAppError;

                if (error instanceof TouriiOnchainAppException) {
                    const response = error.getResponse();
                    if (response instanceof ApiAppError) {
                        errorResponse = new ApiAppError(
                            response.code,
                            response.message,
                            response.type,
                            {
                                ...response.metadata,
                                ...metadata,
                            },
                        );
                    } else {
                        errorResponse = new ApiAppError(
                            defaultError.code,
                            defaultError.message,
                            defaultError.type,
                            metadata,
                        );
                    }
                } else if (error instanceof HttpException) {
                    errorResponse = new ApiAppError(
                        defaultError.code,
                        error.message || defaultError.message,
                        defaultError.type,
                        metadata,
                    );
                } else {
                    errorResponse = new ApiAppError(
                        defaultError.code,
                        defaultError.message,
                        defaultError.type,
                        metadata,
                    );
                }

                return throwError(() => errorResponse);
            }),
        );
    }
}
