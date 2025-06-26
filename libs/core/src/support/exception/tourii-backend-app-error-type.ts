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
    E_TB_023: {
        code: 'E_TB_023',
        message: 'Story not found',
        type: ErrorType.NOT_FOUND,
    },
    E_TB_024: {
        code: 'E_TB_024',
        message: 'Story chapter update failed',
        type: ErrorType.BAD_REQUEST,
    },
    E_TB_025: {
        code: 'E_TB_025',
        message: 'Geo info not found',
        type: ErrorType.NOT_FOUND,
    },
    E_TB_026: {
        code: 'E_TB_026',
        message: 'Current weather not found',
        type: ErrorType.NOT_FOUND,
    },
    E_TB_027: {
        code: 'E_TB_027',
        message: 'Model route not found',
        type: ErrorType.NOT_FOUND,
    },
    E_TB_028: {
        code: 'E_TB_028',
        message: 'Quest task not found',
        type: ErrorType.NOT_FOUND,
    },
    E_TB_029: {
        code: 'E_TB_029',
        message: 'Story chapter already completed',
        type: ErrorType.BAD_REQUEST,
    },
    E_TB_030: {
        code: 'E_TB_030',
        message: 'Invalid task type for QR code scanning',
        type: ErrorType.BAD_REQUEST,
    },
    E_TB_031: {
        code: 'E_TB_031',
        message: 'Invalid QR code',
        type: ErrorType.BAD_REQUEST,
    },
    E_TB_032: {
        code: 'E_TB_032',
        message: 'Task already completed',
        type: ErrorType.BAD_REQUEST,
    },
    E_TB_033: {
        code: 'E_TB_033',
        message: 'Invalid task configuration - malformed required_action',
        type: ErrorType.BAD_REQUEST,
    },
    // --- Storage Specific Errors ---
    E_TB_035: {
        code: 'E_TB_035',
        message:
            'R2 storage endpoint not configured. Set R2_ENDPOINT or R2_ACCOUNT_ID environment variable',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_TB_036: {
        code: 'E_TB_036',
        message: 'R2 storage bucket not configured. Set R2_BUCKET environment variable',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_TB_037: {
        code: 'E_TB_037',
        message: 'File upload to R2 storage failed',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_TB_038: {
        code: 'E_TB_038',
        message: 'Metadata upload to R2 storage failed',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_TB_039: {
        code: 'E_TB_039',
        message: 'R2 public domain not configured. Set R2_PUBLIC_DOMAIN environment variable',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    // --- Authentication Configuration Errors ---
    E_TB_040: {
        code: 'E_TB_040',
        message: 'JWT_SECRET environment variable is required for security',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_TB_041: {
        code: 'E_TB_041',
        message: 'ENCRYPTION_KEY environment variable is required for security',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    // --- PDF & Passport Generation Errors ---
    E_TB_042: {
        code: 'E_TB_042',
        message: 'PDF passport generation failed',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_TB_043: {
        code: 'E_TB_043',
        message: 'Batch passport verification failed',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    E_TB_044: {
        code: 'E_TB_044',
        message: 'Wallet pass generation failed',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    // --- JWT & Token Validation Errors ---
    E_TB_045: {
        code: 'E_TB_045',
        message: 'Invalid QR token structure',
        type: ErrorType.BAD_REQUEST,
    },
    E_TB_046: {
        code: 'E_TB_046',
        message: 'QR token has expired',
        type: ErrorType.BAD_REQUEST,
    },
    E_TB_047: {
        code: 'E_TB_047',
        message: 'Request validation failed',
        type: ErrorType.BAD_REQUEST,
    },
    // --- Geocoding Specific Errors ---
    E_GEO_001: {
        code: 'E_GEO_001',
        message: 'Geocoding: Address not found (ZERO_RESULTS).',
        type: ErrorType.NOT_FOUND,
    },
    E_GEO_002: {
        code: 'E_GEO_002',
        message: 'Geocoding: API key invalid or request denied by provider.',
        type: ErrorType.UNAUTHORIZED, // Or ErrorType.BAD_REQUEST depending on how it's handled
    },
    E_GEO_003: {
        code: 'E_GEO_003',
        message: 'Geocoding: API provider rate limit exceeded.',
        type: ErrorType.BAD_REQUEST, // Placeholder: Ideally ErrorType.TOO_MANY_REQUESTS if it existed
    },
    E_GEO_004: {
        code: 'E_GEO_004',
        message: 'Geocoding: External API error during geocoding request.',
        type: ErrorType.INTERNAL_SERVER_ERROR, // Or a more specific ErrorType.EXTERNAL_API_ERROR
    },
    E_GEO_005: {
        code: 'E_GEO_005',
        message: 'Geocoding: GOOGLE_MAPS_API_KEY not configured in server environment.',
        type: ErrorType.INTERNAL_SERVER_ERROR,
    },
    // --- Weather Specific Errors ---
    E_WEATHER_001: {
        code: 'E_WEATHER_001',
        message: 'Weather API: Location not found or no data available.',
        type: ErrorType.NOT_FOUND,
    },
    E_WEATHER_002: {
        code: 'E_WEATHER_002',
        message: 'Weather API: API key invalid or request denied by provider.',
        type: ErrorType.UNAUTHORIZED, // Or ErrorType.BAD_REQUEST
    },
    E_WEATHER_003: {
        code: 'E_WEATHER_003',
        message: 'Weather API: API provider rate limit exceeded.',
        type: ErrorType.BAD_REQUEST, // Placeholder: Ideally ErrorType.TOO_MANY_REQUESTS
    },
    E_WEATHER_004: {
        code: 'E_WEATHER_004',
        message: 'Weather API: External API error during weather data request.',
        type: ErrorType.INTERNAL_SERVER_ERROR, // Or a more specific ErrorType.EXTERNAL_API_ERROR
    },
    E_WEATHER_005: {
        code: 'E_WEATHER_005',
        message: 'Weather API: WEATHER_API_KEY not configured in server environment.',
        type: ErrorType.INTERNAL_SERVER_ERROR,
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
