import type { AppError } from '@app/core/support/exception/app-error';
import { ErrorType } from '@app/core/support/exception/error-type';

export interface ITouriiOnchainAppError extends AppError {
    type: ErrorType;
}

export const TouriiOnchainAppErrorType = {
    E_OC_001: {
        code: 'E_OC_001',
        message: 'Resource not found',
        type: ErrorType.NOT_FOUND,
    },
    E_OC_002: {
        code: 'E_OC_002',
        message: 'Internal Server Error',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_OC_003: {
        code: 'E_OC_003',
        message: 'Version header is missing',
        type: ErrorType.BAD_REQUEST,
    },
    E_OC_004: {
        code: 'E_OC_004',
        message: 'Version format is invalid',
        type: ErrorType.BAD_REQUEST,
    },
    E_OC_005: {
        code: 'E_OC_005',
        message: 'Version is deprecated',
        type: ErrorType.BAD_REQUEST,
    },
} as const;

type TouriiOnchainAppErrorKeys = keyof typeof TouriiOnchainAppErrorType;

export type TouriiOnchainAppErrorType = {
    [K in TouriiOnchainAppErrorKeys]: {
        code: string;
        message: string;
        type: ErrorType;
    };
};
