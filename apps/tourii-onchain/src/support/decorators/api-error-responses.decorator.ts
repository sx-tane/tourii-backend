import { HttpStatus, applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { TouriiOnchainAppErrorType } from '../exception/tourii-onchain-app-error-type';

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

export const ApiResourceNotFoundResponse = (description = 'Resource Not Found') =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.NOT_FOUND, // 404
            description,
            schema: createErrorSchema(TouriiOnchainAppErrorType.E_OC_001),
        }),
    );

export const ApiInternalServerErrorResponse = (description = 'Internal Server Error') =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.INTERNAL_SERVER_ERROR, // 500
            description,
            schema: createErrorSchema(TouriiOnchainAppErrorType.E_OC_002),
        }),
    );

export const ApiInvalidVersionResponse = (description = 'Bad Request - Invalid version format') =>
    applyDecorators(
        ApiResponse({
            status: HttpStatus.BAD_REQUEST, // 400
            description,
            schema: createErrorSchema(TouriiOnchainAppErrorType.E_OC_004),
        }),
    );
