import type { AppError } from "./app-error";
import { ErrorType } from "./error-type";


export interface ITouriiBackendAppError extends AppError {
  type: ErrorType;
}

export interface ITouriiBackendAppError extends AppError {
  type: ErrorType;
}

export const TouriiBackendAppErrorType = {
  E_BR_000: {
    code: 'E_BR_000',
    message: 'Internal Server Error',
    type: ErrorType.INTERNAL_SERVER_ERROR,
  },
  E_BR_001: {
    code: 'E_BR_001',
    message: 'Bad Request',
    type: ErrorType.BAD_REQUEST,
  }
} as const;

type TouriiBackendAppErrorKeys =
  keyof typeof TouriiBackendAppErrorType;

export type TouriiBackendAppErrorType = {
  [K in TouriiBackendAppErrorKeys]: {
    code: string;
    message: string;
    type: ErrorType;
  };
};
