/**
 * Enhanced type definitions for AI Route Recommendation System
 * Provides branded types and stricter validation for better type safety
 */

// =============================================================================
// BRANDED TYPES
// =============================================================================

/**
 * Branded string types to prevent type confusion
 */
export type RouteId = string & { readonly __brand: 'RouteId' };
export type TouristSpotId = string & { readonly __brand: 'TouristSpotId' };
export type UserId = string & { readonly __brand: 'UserId' };
export type Keyword = string & { readonly __brand: 'Keyword' };
export type Hashtag = string & { readonly __brand: 'Hashtag' };
export type Region = string & { readonly __brand: 'Region' };
export type DurationString = string & { readonly __brand: 'Duration' }; // e.g., "2-3 days"

/**
 * Branded number types with validation
 */
export type Latitude = number & { readonly __brand: 'Latitude' }; // -90 to 90
export type Longitude = number & { readonly __brand: 'Longitude' }; // -180 to 180
export type ConfidenceScore = number & { readonly __brand: 'ConfidenceScore' }; // 0-1
export type ProximityRadius = number & { readonly __brand: 'ProximityRadius' }; // km, 1-200
export type Distance = number & { readonly __brand: 'Distance' }; // km, >= 0

// =============================================================================
// COORDINATE SYSTEM
// =============================================================================

/**
 * Immutable coordinate representation
 */
export interface Coordinates {
    readonly lat: Latitude;
    readonly lng: Longitude;
}

/**
 * Coordinate with elevation data
 */
export interface ExtendedCoordinates extends Coordinates {
    readonly elevation?: number;
    readonly accuracy?: number;
}

// =============================================================================
// SEARCH AND MATCHING
// =============================================================================

/**
 * Search mode for keyword matching
 */
export type SearchMode = 'all' | 'any';

/**
 * Validated search request
 */
export interface ValidatedSearchRequest {
    readonly keywords: ReadonlyArray<Keyword>;
    readonly mode: SearchMode;
    readonly region?: Region;
    readonly userId?: UserId;
}

/**
 * Clustering options with validated ranges
 */
export interface ClusteringOptions {
    readonly proximityRadiusKm: ProximityRadius;
    readonly minSpotsPerCluster: number; // 1-10
    readonly maxSpotsPerCluster: number; // 2-15
}

// =============================================================================
// TOURIST SPOT TYPES
// =============================================================================

/**
 * Core tourist spot data with validated types
 */
export interface StrictTouristSpot {
    readonly touristSpotId: TouristSpotId;
    readonly touristSpotName: string;
    readonly touristSpotDesc?: string;
    readonly coordinates: Coordinates;
    readonly hashtags: ReadonlyArray<Hashtag>;
    readonly region: Region;
    readonly createdAt: Date;
    readonly updatedAt: Date;
}

/**
 * Tourist spot with matching context
 */
export interface MatchedTouristSpot extends StrictTouristSpot {
    readonly matchedKeywords: ReadonlyArray<Keyword>;
    readonly relevanceScore: ConfidenceScore;
    readonly distanceFromCenter?: Distance;
}

// =============================================================================
// CLUSTERING TYPES
// =============================================================================

/**
 * Geographic cluster of tourist spots
 */
export interface TouristSpotCluster {
    readonly clusterId: string;
    readonly spots: ReadonlyArray<MatchedTouristSpot>;
    readonly centerCoordinates: Coordinates;
    readonly averageDistance: Distance;
    readonly commonHashtags: ReadonlyArray<Hashtag>;
    readonly region: Region;
    readonly boundingBox: {
        readonly northEast: Coordinates;
        readonly southWest: Coordinates;
    };
}

// =============================================================================
// AI CONTENT TYPES
// =============================================================================

/**
 * AI-generated content with validation
 */
export interface AiGeneratedContent {
    readonly routeName: string; // max 100 chars
    readonly regionDesc: string; // max 500 chars
    readonly recommendations: ReadonlyArray<Hashtag>; // max 10 items
    readonly estimatedDuration: DurationString;
    readonly confidenceScore: ConfidenceScore;
    readonly generatedAt: Date;
    readonly modelUsed: string;
    readonly promptVersion: string;
}

/**
 * AI generation request with constraints
 */
export interface AiContentGenerationRequest {
    readonly keywords: ReadonlyArray<Keyword>;
    readonly spotNames: ReadonlyArray<string>;
    readonly commonHashtags: ReadonlyArray<Hashtag>;
    readonly region: Region;
    readonly spotCount: number; // 2-15
    readonly additionalContext?: string;
}

// =============================================================================
// MODEL ROUTE TYPES
// =============================================================================

/**
 * Complete model route with validated data
 */
export interface StrictModelRoute {
    readonly modelRouteId: RouteId;
    readonly routeName: string;
    readonly region: Region;
    readonly regionDesc: string;
    readonly recommendations: ReadonlyArray<Hashtag>;
    readonly coordinates: Coordinates;
    readonly backgroundMediaUrl?: string;
    readonly storyId?: string; // Optional for standalone routes
    readonly createdBy: UserId;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly isAiGenerated: boolean;
}

/**
 * Route creation request with validation
 */
export interface RouteCreationRequest {
    readonly routeName: string; // 1-100 chars
    readonly region: Region;
    readonly regionDesc: string; // 1-500 chars
    readonly recommendations: ReadonlyArray<Hashtag>; // 1-10 items
    readonly coordinates: Coordinates;
    readonly backgroundMediaUrl?: string;
    readonly storyId?: string;
    readonly userId: UserId;
}

// =============================================================================
// RESULT TYPES
// =============================================================================

/**
 * Complete route generation result
 */
export interface RouteGenerationResult {
    readonly modelRoute: StrictModelRoute;
    readonly aiContent: AiGeneratedContent;
    readonly cluster: TouristSpotCluster;
    readonly metadata: RouteGenerationMetadata;
}

/**
 * Metadata for route generation
 */
export interface RouteGenerationMetadata {
    readonly sourceKeywords: ReadonlyArray<Keyword>;
    readonly algorithm: string;
    readonly spotCount: number;
    readonly processingTimeMs: number;
    readonly generatedAt: Date;
    readonly cacheUsed: boolean;
}

/**
 * Complete recommendation result
 */
export interface RouteRecommendationResult {
    readonly generatedRoutes: ReadonlyArray<RouteGenerationResult>;
    readonly summary: RecommendationSummary;
    readonly requestMetadata: RequestMetadata;
}

/**
 * Summary statistics
 */
export interface RecommendationSummary {
    readonly totalSpotsFound: number;
    readonly clustersFormed: number;
    readonly routesGenerated: number;
    readonly processingTimeMs: number;
    readonly cacheHitRate: number; // 0-1
    readonly aiGenerationSuccessRate: number; // 0-1
}

/**
 * Request processing metadata
 */
export interface RequestMetadata {
    readonly requestId: string;
    readonly userId?: UserId;
    readonly requestedAt: Date;
    readonly completedAt: Date;
    readonly ipAddress?: string;
    readonly userAgent?: string;
}

// =============================================================================
// ERROR TYPES
// =============================================================================

/**
 * Error context for debugging
 */
export interface ErrorContext {
    readonly requestId: string;
    readonly userId?: UserId;
    readonly operation: string;
    readonly timestamp: Date;
    readonly additionalData?: Record<string, unknown>;
}

/**
 * Validation error details
 */
export interface ValidationErrorDetails {
    readonly field: string;
    readonly value: unknown;
    readonly constraint: string;
    readonly message: string;
}

// =============================================================================
// TYPE GUARDS AND VALIDATORS
// =============================================================================

/**
 * Type guard functions for runtime validation
 */
export const TypeGuards = {
    isValidLatitude: (value: number): value is Latitude =>
        typeof value === 'number' && value >= -90 && value <= 90,

    isValidLongitude: (value: number): value is Longitude =>
        typeof value === 'number' && value >= -180 && value <= 180,

    isValidConfidenceScore: (value: number): value is ConfidenceScore =>
        typeof value === 'number' && value >= 0 && value <= 1,

    isValidProximityRadius: (value: number): value is ProximityRadius =>
        typeof value === 'number' && value >= 1 && value <= 200,

    isValidKeyword: (value: string): value is Keyword =>
        typeof value === 'string' && value.length >= 1 && value.length <= 50,

    isValidSearchMode: (value: string): value is SearchMode => value === 'all' || value === 'any',

    isValidDurationString: (value: string): value is DurationString =>
        typeof value === 'string' && /^\d+-\d+\s+(day|days|hour|hours)$/i.test(value),
} as const;

/**
 * Brand type constructors with validation
 */
export const TypeConstructors = {
    createRouteId: (value: string): RouteId => {
        if (!value || typeof value !== 'string') {
            throw new Error('Invalid RouteId: must be non-empty string');
        }
        return value as RouteId;
    },

    createTouristSpotId: (value: string): TouristSpotId => {
        if (!value || typeof value !== 'string') {
            throw new Error('Invalid TouristSpotId: must be non-empty string');
        }
        return value as TouristSpotId;
    },

    createKeyword: (value: string): Keyword => {
        if (!TypeGuards.isValidKeyword(value)) {
            throw new Error('Invalid Keyword: must be 1-50 characters');
        }
        return value as Keyword;
    },

    createCoordinates: (lat: number, lng: number): Coordinates => {
        if (!TypeGuards.isValidLatitude(lat)) {
            throw new Error('Invalid latitude: must be between -90 and 90');
        }
        if (!TypeGuards.isValidLongitude(lng)) {
            throw new Error('Invalid longitude: must be between -180 and 180');
        }
        return { lat: lat as Latitude, lng: lng as Longitude };
    },

    createConfidenceScore: (value: number): ConfidenceScore => {
        if (!TypeGuards.isValidConfidenceScore(value)) {
            throw new Error('Invalid confidence score: must be between 0 and 1');
        }
        return value as ConfidenceScore;
    },
} as const;

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Make all properties in T optional recursively
 */
export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Extract branded type from branded union
 */
export type UnwrapBranded<T> = T extends infer U & { __brand: string } ? U : T;

/**
 * Readonly array of specific branded type
 */
export type ReadonlyBrandedArray<T> = ReadonlyArray<T>;

/**
 * Non-empty array constraint
 */
export type NonEmptyArray<T> = [T, ...T[]];

export type NonEmptyKeywords = NonEmptyArray<Keyword>;
export type NonEmptyHashtags = NonEmptyArray<Hashtag>;
