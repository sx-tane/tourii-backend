/**
 * Configuration constants for AI Route Recommendation System
 * Centralizes all magic numbers and configuration values for better maintainability
 */

export const AI_ROUTE_CONFIG = {
    /**
     * Geographic Clustering Configuration
     */
    CLUSTERING: {
        /** Default proximity radius for clustering tourist spots (kilometers) */
        DEFAULT_PROXIMITY_RADIUS_KM: 50,
        
        /** Minimum proximity radius allowed (kilometers) */
        MIN_PROXIMITY_RADIUS_KM: 1,
        
        /** Maximum proximity radius allowed (kilometers) */
        MAX_PROXIMITY_RADIUS_KM: 200,
        
        /** Default minimum spots required to form a cluster */
        DEFAULT_MIN_SPOTS_PER_CLUSTER: 2,
        
        /** Default maximum spots allowed in a cluster */
        DEFAULT_MAX_SPOTS_PER_CLUSTER: 8,
        
        /** Maximum clusters to process in a single request */
        MAX_CLUSTERS_PER_REQUEST: 20,
        
        /** Hashtag threshold percentage for common hashtag detection */
        HASHTAG_THRESHOLD_PERCENTAGE: 0.3,
        
        /** Minimum hashtag appearances required */
        MIN_HASHTAG_APPEARANCES: 2,
    },

    /**
     * Keyword Search Configuration
     */
    SEARCH: {
        /** Maximum keywords allowed in a single request */
        MAX_KEYWORDS: 10,
        
        /** Minimum keyword length */
        MIN_KEYWORD_LENGTH: 1,
        
        /** Maximum keyword length */
        MAX_KEYWORD_LENGTH: 50,
        
        /** Default maximum routes to generate */
        DEFAULT_MAX_ROUTES: 5,
        
        /** Maximum routes allowed in a single request */
        MAX_ROUTES_LIMIT: 20,
    },

    /**
     * OpenAI/GPT Configuration
     */
    OPENAI: {
        /** Default model to use for content generation */
        DEFAULT_MODEL: 'gpt-4o-mini',
        
        /** Maximum tokens for GPT response */
        MAX_TOKENS: 1000,
        
        /** Temperature for content generation (0-1, lower = more deterministic) */
        TEMPERATURE: 0.7,
        
        /** Maximum retries for failed AI requests */
        MAX_RETRIES: 3,
        
        /** Timeout for AI requests (milliseconds) */
        REQUEST_TIMEOUT_MS: 30000,
        
        /** Minimum confidence score to accept AI-generated content */
        MIN_CONFIDENCE_SCORE: 0.6,
    },

    /**
     * Caching Configuration
     */
    CACHE: {
        /** Cache TTL for tourist spot searches (seconds) */
        TOURIST_SPOTS_TTL: 1800, // 30 minutes
        
        /** Cache TTL for AI-generated content (seconds) */
        AI_CONTENT_TTL: 3600, // 1 hour
        
        /** Cache TTL for route recommendations (seconds) */
        ROUTE_RECOMMENDATIONS_TTL: 900, // 15 minutes
        
        /** Cache key prefix for route recommendations */
        ROUTE_CACHE_PREFIX: 'ai-route:',
        
        /** Cache key prefix for tourist spot searches */
        SPOTS_CACHE_PREFIX: 'spots-search:',
    },

    /**
     * Rate Limiting Configuration
     */
    RATE_LIMITING: {
        /** Rate limit window (milliseconds) */
        WINDOW_MS: 60000, // 1 minute
        
        /** Maximum requests per window for authenticated users */
        MAX_REQUESTS_PER_WINDOW: 10,
        
        /** Maximum requests per window for anonymous users */
        MAX_ANONYMOUS_REQUESTS: 3,
        
        /** AI generation rate limit per user per hour */
        AI_GENERATION_LIMIT_PER_HOUR: 20,
        
        /** Cooldown period after rate limit exceeded (seconds) */
        RATE_LIMIT_COOLDOWN_SECONDS: 300, // 5 minutes
    },

    /**
     * Default Values and Fallbacks
     */
    DEFAULTS: {
        /** Default region description when none provided */
        DEFAULT_REGION_DESC: 'Discover amazing locations in this beautiful region of Japan',
        
        /** Default route name when AI generation fails */
        FALLBACK_ROUTE_NAME: 'Scenic Discovery Route',
        
        /** Default estimated duration */
        DEFAULT_ESTIMATED_DURATION: '1-2 days',
        
        /** Default background image for routes */
        DEFAULT_BACKGROUND_IMAGE: 'https://example.com/default-japan-landscape.jpg',
        
        /** Default recommendations when AI fails */
        FALLBACK_RECOMMENDATIONS: ['scenic', 'discovery', 'culture'],
    },

    /**
     * Validation Limits
     */
    VALIDATION: {
        /** Maximum route name length */
        MAX_ROUTE_NAME_LENGTH: 100,
        
        /** Maximum region description length */
        MAX_REGION_DESC_LENGTH: 500,
        
        /** Maximum recommendations array length */
        MAX_RECOMMENDATIONS_COUNT: 10,
        
        /** Minimum confidence score for accepting results */
        MIN_RESULT_CONFIDENCE: 0.5,
    },

    /**
     * Performance Thresholds
     */
    PERFORMANCE: {
        /** Maximum processing time warning threshold (milliseconds) */
        SLOW_REQUEST_THRESHOLD_MS: 5000,
        
        /** Maximum tourist spots to process in memory */
        MAX_SPOTS_IN_MEMORY: 1000,
        
        /** Batch size for database operations */
        DB_BATCH_SIZE: 50,
    },

    /**
     * Feature Flags
     */
    FEATURES: {
        /** Enable AI content generation */
        AI_GENERATION_ENABLED: true,
        
        /** Enable caching for requests */
        CACHING_ENABLED: true,
        
        /** Enable rate limiting */
        RATE_LIMITING_ENABLED: true,
        
        /** Enable performance monitoring */
        PERFORMANCE_MONITORING_ENABLED: true,
        
        /** Use fallback when AI service is unavailable */
        FALLBACK_MODE_ENABLED: true,
    },
} as const;

/**
 * Environment-specific configuration overrides
 */
export const getEnvironmentConfig = () => {
    const env = process.env.NODE_ENV || 'development';
    
    const envOverrides = {
        development: {
            OPENAI: {
                MAX_RETRIES: 1,
                REQUEST_TIMEOUT_MS: 10000,
            },
            CACHE: {
                AI_CONTENT_TTL: 300, // 5 minutes for faster development iteration
            },
            RATE_LIMITING: {
                MAX_REQUESTS_PER_WINDOW: 100, // More lenient for development
            },
        },
        production: {
            OPENAI: {
                MAX_RETRIES: 3,
                REQUEST_TIMEOUT_MS: 30000,
            },
            RATE_LIMITING: {
                MAX_REQUESTS_PER_WINDOW: 5, // Stricter for production
            },
        },
        test: {
            FEATURES: {
                AI_GENERATION_ENABLED: false, // Mock AI in tests
                CACHING_ENABLED: false,
                RATE_LIMITING_ENABLED: false,
            },
        },
    };

    return {
        ...AI_ROUTE_CONFIG,
        ...envOverrides[env as keyof typeof envOverrides],
    };
};

/**
 * Type-safe configuration getter
 */
export type AiRouteConfig = typeof AI_ROUTE_CONFIG;
export const getAiRouteConfig = (): AiRouteConfig => getEnvironmentConfig() as AiRouteConfig;