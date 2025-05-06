import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

// Helper to generate the standard schema
const createErrorSchema = (errorType: {
    code: string;
    message: string;
    type: string;
}) => ({
    type: 'object',
    properties: {
        code: {
            type: 'string',
            example: errorType.code,
        },
        message: {
            type: 'string',
            example: errorType.message,
        },
        type: {
            type: 'string',
            example: errorType.type,
        },
    },
});

// --- Specific Error Decorators ---

export const ApiUnauthorizedResponse = (
    description = 'Unauthorized - Invalid or missing API key',
) =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.UNAUTHORIZED, // 401
            description,
            schema: createErrorSchema(TouriiBackendAppErrorType.E_TB_010),
        }),
    );

export const ApiDefaultBadRequestResponse = (
    description = 'Bad Request - Invalid request body or version',
) =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.BAD_REQUEST, // 400
            description,
            schema: createErrorSchema(TouriiBackendAppErrorType.E_TB_001),
        }),
    );

export const ApiInvalidVersionResponse = (
    description = 'Bad Request - Invalid version format',
) =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.BAD_REQUEST, // 400
            description,
            schema: createErrorSchema(TouriiBackendAppErrorType.E_TB_021),
        }),
    );

export const ApiUserExistsResponse = (
    description = 'Bad Request - User already exists',
) =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.BAD_REQUEST, // 400
            description,
            schema: createErrorSchema(TouriiBackendAppErrorType.E_TB_006),
        }),
    );

export const ApiUserNotFoundResponse = (description = 'User not found') =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.NOT_FOUND, // 404
            description,
            schema: createErrorSchema(TouriiBackendAppErrorType.E_TB_004),
        }),
    );
