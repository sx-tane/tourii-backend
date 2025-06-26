import { HttpStatus } from '@nestjs/common';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';

/**
 * Base exception class for AI Route Recommendation errors
 */
export abstract class AiRouteRecommendationException extends TouriiBackendAppException {
    constructor(
        errorType: TouriiBackendAppErrorType,
        message: string,
        httpStatus: HttpStatus,
        details?: any,
    ) {
        super(errorType, message, httpStatus, details);
    }
}

/**
 * Exception for validation errors in AI route recommendation requests
 */
export class AiRouteValidationException extends AiRouteRecommendationException {
    constructor(message: string, details?: any) {
        super(
            TouriiBackendAppErrorType.E_TB_050,
            message,
            HttpStatus.BAD_REQUEST,
            details,
        );
    }

    static keywordsRequired(): AiRouteValidationException {
        return new AiRouteValidationException(
            'Keywords are required for route recommendation',
            { field: 'keywords', requirement: 'non-empty array' },
        );
    }

    static invalidKeywordCount(count: number, max: number): AiRouteValidationException {
        return new AiRouteValidationException(
            `Too many keywords provided. Maximum ${max} keywords allowed, got ${count}`,
            { providedCount: count, maxAllowed: max },
        );
    }

    static invalidProximityRadius(radius: number): AiRouteValidationException {
        return new AiRouteValidationException(
            `Invalid proximity radius: ${radius}. Must be between 1 and 200 kilometers`,
            { providedRadius: radius, validRange: '1-200 km' },
        );
    }
}

/**
 * Exception for tourist spot search errors
 */
export class TouristSpotSearchException extends AiRouteRecommendationException {
    constructor(message: string, details?: any) {
        super(
            TouriiBackendAppErrorType.E_TB_051,
            message,
            HttpStatus.NOT_FOUND,
            details,
        );
    }

    static noSpotsFound(keywords: string[]): TouristSpotSearchException {
        return new TouristSpotSearchException(
            'No tourist spots found matching the provided keywords',
            { searchKeywords: keywords },
        );
    }

    static insufficientSpotsForClustering(spotCount: number, minRequired: number): TouristSpotSearchException {
        return new TouristSpotSearchException(
            `Insufficient tourist spots for route generation. Found ${spotCount}, minimum ${minRequired} required`,
            { spotsFound: spotCount, minRequired },
        );
    }
}

/**
 * Exception for geographic clustering errors
 */
export class GeographicClusteringException extends AiRouteRecommendationException {
    constructor(message: string, details?: any) {
        super(
            TouriiBackendAppErrorType.E_TB_052,
            message,
            HttpStatus.INTERNAL_SERVER_ERROR,
            details,
        );
    }

    static clusteringFailed(reason: string): GeographicClusteringException {
        return new GeographicClusteringException(
            `Geographic clustering failed: ${reason}`,
            { failureReason: reason },
        );
    }

    static noClustersFormed(): GeographicClusteringException {
        return new GeographicClusteringException(
            'No viable clusters formed from the tourist spots',
            { hint: 'Try increasing proximity radius or reducing minimum spots per cluster' },
        );
    }
}

/**
 * Exception for AI content generation errors
 */
export class AiContentGenerationException extends AiRouteRecommendationException {
    constructor(message: string, details?: any) {
        super(
            TouriiBackendAppErrorType.E_TB_053,
            message,
            HttpStatus.SERVICE_UNAVAILABLE,
            details,
        );
    }

    static aiServiceUnavailable(): AiContentGenerationException {
        return new AiContentGenerationException(
            'AI content generation service is temporarily unavailable',
            { fallbackMode: 'Using template-based content generation' },
        );
    }

    static contentGenerationFailed(error: string): AiContentGenerationException {
        return new AiContentGenerationException(
            `AI content generation failed: ${error}`,
            { originalError: error, suggestion: 'Retry with different keywords' },
        );
    }

    static rateLimitExceeded(userId?: string): AiContentGenerationException {
        return new AiContentGenerationException(
            'AI service rate limit exceeded. Please try again later',
            { userId, retryAfter: '5 minutes' },
        );
    }
}

/**
 * Exception for route creation/persistence errors
 */
export class RouteCreationException extends AiRouteRecommendationException {
    constructor(message: string, details?: any) {
        super(
            TouriiBackendAppErrorType.E_TB_054,
            message,
            HttpStatus.INTERNAL_SERVER_ERROR,
            details,
        );
    }

    static routePersistenceFailed(error: string): RouteCreationException {
        return new RouteCreationException(
            `Failed to persist AI-generated route to database: ${error}`,
            { originalError: error },
        );
    }

    static invalidRouteData(missingFields: string[]): RouteCreationException {
        return new RouteCreationException(
            `Cannot create route due to missing required data: ${missingFields.join(', ')}`,
            { missingFields },
        );
    }
}