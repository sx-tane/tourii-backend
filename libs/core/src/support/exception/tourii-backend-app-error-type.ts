import type { AppError } from './app-error';
import { ErrorType } from './error-type';

export interface ITouriiBackendAppError extends AppError {
  type: ErrorType;
}

export interface ITouriiBackendAppError extends AppError {
  type: ErrorType;
}

export const TouriiBackendAppErrorType = {
  E_TB_000: {
    code: 'E_TB_000',
    message: 'Internal Server Error',
    type: ErrorType.INTERNAL_SERVER_ERROR,
  },
  E_TB_001: {
    code: 'E_TB_001',
    message: 'Bad Request',
    type: ErrorType.BAD_REQUEST,
  },
  E_TB_002: {
    code: 'E_TB_002',
    message: 'Unauthorized',
    type: ErrorType.UNAUTHORIZED,
  },
} as const;

type TouriiBackendAppErrorKeys = keyof typeof TouriiBackendAppErrorType;

export type TouriiBackendAppErrorType = {
  [K in TouriiBackendAppErrorKeys]: {
    code: string;
    message: string;
    type: ErrorType;
  };
};
