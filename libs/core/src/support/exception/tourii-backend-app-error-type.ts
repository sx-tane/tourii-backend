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
  E_TB_003: {
    code: 'E_TB_003',
    message: 'SailsCalls is not ready',
    type: ErrorType.INTERNAL_SERVER_ERROR,
  },
  E_TB_004: {
    code: 'E_TB_004',
    message: 'User is not registered',
    type: ErrorType.UNAUTHORIZED,
  },
  E_TB_005: {
    code: 'E_TB_005',
    message: 'Bad Credentials',
    type: ErrorType.BAD_REQUEST,
  },
  E_TB_006: {
    code: 'E_TB_006',
    message: 'User already exists',
    type: ErrorType.BAD_REQUEST,
  },
  E_TB_007: {
    code: 'E_TB_007',
    message: 'Error while issue a voucher to a signless account',
    type: ErrorType.BAD_REQUEST,
  },
  E_TB_008: {
    code: 'E_TB_008',
    message: 'Error while adding tokens to voucher',
    type: ErrorType.BAD_REQUEST,
  },
  E_TB_009: {
    code: 'E_TB_009',
    message: 'Error while renewing voucher',
    type: ErrorType.BAD_REQUEST,
  },
  E_TB_010: {
    code: 'E_TB_010',
    message: 'API key is required',
    type: ErrorType.UNAUTHORIZED,
  },
  E_TB_011: {
    code: 'E_TB_011',
    message: 'Invalid API key',
    type: ErrorType.UNAUTHORIZED,
  },
  E_TB_020: {
    code: 'E_TB_020',
    message: 'Version header is required',
    type: ErrorType.BAD_REQUEST,
  },
  E_TB_021: {
    code: 'E_TB_021',
    message: 'Invalid version format',
    type: ErrorType.BAD_REQUEST,
  },
  E_TB_022: {
    code: 'E_TB_022',
    message: 'This API version is no longer supported',
    type: ErrorType.BAD_REQUEST,
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
