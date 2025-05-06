import type { ErrorType } from '@app/core/support/exception/error-type';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import {
    ApiAppError,
    TouriiBackendAppException,
} from '@app/core/support/exception/tourii-backend-app-exception';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch(TouriiBackendAppException, HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: TouriiBackendAppException | HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: number;
        let errorResponse: ApiAppError;
        const defaultError = TouriiBackendAppErrorType.E_TB_000; // Default Internal Server Error

        if (exception instanceof TouriiBackendAppException) {
            const appError = exception.getResponse();
            if (appError instanceof ApiAppError) {
                // Determine status code based on error code/type if possible
                switch (appError.code) {
                    case TouriiBackendAppErrorType.E_TB_010.code:
                    case TouriiBackendAppErrorType.E_TB_011.code:
                    case TouriiBackendAppErrorType.E_TB_020.code:
                    case TouriiBackendAppErrorType.E_TB_021.code:
                    case TouriiBackendAppErrorType.E_TB_022.code:
                        status = HttpStatus.UNAUTHORIZED; // 401 for these specific errors
                        break;
                    // Add other specific status codes here if needed
                    default:
                        status = HttpStatus.BAD_REQUEST; // Default to 400 for other app errors
                }
                errorResponse = appError;
            } else {
                // Fallback if getResponse() didn't return ApiAppError
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                errorResponse = new ApiAppError(
                    defaultError.code,
                    defaultError.message,
                    defaultError.type,
                );
            }
        } else if (exception instanceof HttpException) {
            // Handle standard NestJS HttpExceptions
            status = exception.getStatus();
            const httpErrorResponse = exception.getResponse();
            let message = 'Http Exception';
            if (typeof httpErrorResponse === 'string') {
                message = httpErrorResponse;
            } else if (
                typeof httpErrorResponse === 'object' &&
                httpErrorResponse !== null &&
                'message' in httpErrorResponse
            ) {
                message = (
                    httpErrorResponse as {
                        message: string;
                    }
                ).message;
            }
            errorResponse = new ApiAppError(
                `HTTP_${status}`,
                message,
                'HTTP_EXCEPTION' as ErrorType, // Cast to ErrorType
            );
        } else {
            // Catch-all for unexpected errors
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            errorResponse = new ApiAppError(
                defaultError.code,
                defaultError.message,
                defaultError.type,
            );
        }

        response.status(status).json({
            ...errorResponse,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
