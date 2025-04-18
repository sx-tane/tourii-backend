import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException, ApiAppError, ErrorMetadata } from '@app/core/support/exception/tourii-backend-app-exception';
import { ErrorType } from '@app/core/support/exception/error-type';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError(error => {
        const defaultError = TouriiBackendAppErrorType.E_TB_000;
        const metadata: ErrorMetadata = {};

        // Handle API key validation status if present
        if (error.response?.apiKey?.valid !== undefined) {
          metadata.apiKey = { valid: error.response.apiKey.valid };
        }

        // Handle custom status code if present
        if (error.response?.statusCode === 410 || error.metadata?.statusCode === 410) {
          metadata.statusCode = 410;
        }

        let errorResponse: ApiAppError;

        if (error instanceof TouriiBackendAppException) {
          const response = error.getResponse();
          if (response instanceof ApiAppError) {
            errorResponse = new ApiAppError(response.code, response.message, response.type, {
              ...response.metadata,
              ...metadata
            });
          } else {
            errorResponse = new ApiAppError(defaultError.code, defaultError.message, defaultError.type, metadata);
          }
        } else if (error instanceof HttpException) {
          errorResponse = new ApiAppError(
            defaultError.code,
            error.message || defaultError.message,
            defaultError.type,
            metadata
          );
        } else {
          errorResponse = new ApiAppError(defaultError.code, defaultError.message, defaultError.type, metadata);
        }

        return throwError(() => errorResponse);
      }),
    );
  }
} 