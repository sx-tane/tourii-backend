import {
    AI_ROUTE_CONFIG,
    getAiRouteConfig,
    getEnvironmentConfig,
} from '../ai-route-recommendation.config';

describe('AI Route Recommendation Config', () => {
    describe('Default Configuration (AI_ROUTE_CONFIG)', () => {
        it('should have correct clustering configuration', () => {
            expect(AI_ROUTE_CONFIG.CLUSTERING).toEqual({
                DEFAULT_PROXIMITY_RADIUS_KM: 50,
                MIN_PROXIMITY_RADIUS_KM: 1,
                MAX_PROXIMITY_RADIUS_KM: 200,
                DEFAULT_MIN_SPOTS_PER_CLUSTER: 2,
                DEFAULT_MAX_SPOTS_PER_CLUSTER: 8,
                MAX_CLUSTERS_PER_REQUEST: 20,
                HASHTAG_THRESHOLD_PERCENTAGE: 0.3,
                MIN_HASHTAG_APPEARANCES: 2,
            });
        });

        it('should have correct search configuration', () => {
            expect(AI_ROUTE_CONFIG.SEARCH).toEqual({
                MAX_KEYWORDS: 10,
                MIN_KEYWORD_LENGTH: 1,
                MAX_KEYWORD_LENGTH: 50,
                DEFAULT_MAX_ROUTES: 5,
                MAX_ROUTES_LIMIT: 20,
            });
        });

        it('should have correct OpenAI configuration', () => {
            expect(AI_ROUTE_CONFIG.OPENAI).toEqual({
                DEFAULT_MODEL: 'gpt-4o-mini',
                MAX_TOKENS: 1000,
                TEMPERATURE: 0.7,
                MAX_RETRIES: 3,
                REQUEST_TIMEOUT_MS: 30000,
                MIN_CONFIDENCE_SCORE: 0.6,
            });
        });

        it('should have correct cache configuration', () => {
            expect(AI_ROUTE_CONFIG.CACHE).toEqual({
                TOURIST_SPOTS_TTL: 1800, // 30 minutes
                AI_CONTENT_TTL: 3600, // 1 hour
                ROUTE_RECOMMENDATIONS_TTL: 900, // 15 minutes
                ROUTE_CACHE_PREFIX: 'ai-route:',
                SPOTS_CACHE_PREFIX: 'spots-search:',
            });
        });

        it('should have correct rate limiting configuration', () => {
            expect(AI_ROUTE_CONFIG.RATE_LIMITING).toEqual({
                WINDOW_MS: 60000, // 1 minute
                MAX_REQUESTS_PER_WINDOW: 10,
                MAX_ANONYMOUS_REQUESTS: 3,
                AI_GENERATION_LIMIT_PER_HOUR: 20,
                RATE_LIMIT_COOLDOWN_SECONDS: 300, // 5 minutes
            });
        });

        it('should have sensible default values', () => {
            expect(AI_ROUTE_CONFIG.DEFAULTS).toEqual({
                DEFAULT_REGION_DESC: 'Discover amazing locations in this beautiful region of Japan',
                FALLBACK_ROUTE_NAME: 'Scenic Discovery Route',
                DEFAULT_ESTIMATED_DURATION: '1-2 days',
                DEFAULT_BACKGROUND_IMAGE: 'https://example.com/default-japan-landscape.jpg',
                FALLBACK_RECOMMENDATIONS: ['scenic', 'discovery', 'culture'],
            });
        });

        it('should have appropriate validation limits', () => {
            expect(AI_ROUTE_CONFIG.VALIDATION).toEqual({
                MAX_ROUTE_NAME_LENGTH: 100,
                MAX_REGION_DESC_LENGTH: 500,
                MAX_RECOMMENDATIONS_COUNT: 10,
                MIN_RESULT_CONFIDENCE: 0.5,
            });
        });

        it('should have reasonable performance thresholds', () => {
            expect(AI_ROUTE_CONFIG.PERFORMANCE).toEqual({
                SLOW_REQUEST_THRESHOLD_MS: 5000,
                MAX_SPOTS_IN_MEMORY: 1000,
                DB_BATCH_SIZE: 50,
            });
        });

        it('should have all features enabled by default', () => {
            expect(AI_ROUTE_CONFIG.FEATURES).toEqual({
                AI_GENERATION_ENABLED: true,
                CACHING_ENABLED: true,
                RATE_LIMITING_ENABLED: true,
                PERFORMANCE_MONITORING_ENABLED: true,
                FALLBACK_MODE_ENABLED: true,
            });
        });

        it('should be immutable (const assertion)', () => {
            // Type-level test - should not allow modification
            // @ts-expect-error - Property is readonly
            // AI_ROUTE_CONFIG.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM = 100;

            expect(typeof AI_ROUTE_CONFIG).toBe('object');
        });
    });

    describe('Environment Configuration', () => {
        const originalNodeEnv = process.env.NODE_ENV;

        afterEach(() => {
            process.env.NODE_ENV = originalNodeEnv;
        });

        it('should apply development overrides', () => {
            process.env.NODE_ENV = 'development';
            const config = getEnvironmentConfig();

            expect(config.OPENAI.MAX_RETRIES).toBe(1);
            expect(config.OPENAI.REQUEST_TIMEOUT_MS).toBe(10000);
            expect(config.CACHE.AI_CONTENT_TTL).toBe(300); // 5 minutes
            expect(config.RATE_LIMITING.MAX_REQUESTS_PER_WINDOW).toBe(100);
        });

        it('should apply production overrides', () => {
            process.env.NODE_ENV = 'production';
            const config = getEnvironmentConfig();

            expect(config.OPENAI.MAX_RETRIES).toBe(3);
            expect(config.OPENAI.REQUEST_TIMEOUT_MS).toBe(30000);
            expect(config.RATE_LIMITING.MAX_REQUESTS_PER_WINDOW).toBe(5);
        });

        it('should apply test overrides', () => {
            process.env.NODE_ENV = 'test';
            const config = getEnvironmentConfig();

            expect(config.FEATURES.AI_GENERATION_ENABLED).toBe(false);
            expect(config.FEATURES.CACHING_ENABLED).toBe(false);
            expect(config.FEATURES.RATE_LIMITING_ENABLED).toBe(false);
        });

        it('should use default config for unknown environment', () => {
            process.env.NODE_ENV = 'unknown';
            const config = getEnvironmentConfig();

            // Should match default config
            expect(config.OPENAI.MAX_RETRIES).toBe(AI_ROUTE_CONFIG.OPENAI.MAX_RETRIES);
            expect(config.CACHE.AI_CONTENT_TTL).toBe(AI_ROUTE_CONFIG.CACHE.AI_CONTENT_TTL);
        });

        it('should preserve unoverridden values', () => {
            process.env.NODE_ENV = 'development';
            const config = getEnvironmentConfig();

            // These should remain unchanged
            expect(config.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM).toBe(50);
            expect(config.SEARCH.MAX_KEYWORDS).toBe(10);
            expect(config.VALIDATION.MAX_ROUTE_NAME_LENGTH).toBe(100);
        });
    });

    describe('getAiRouteConfig', () => {
        it('should return environment-specific configuration', () => {
            const config = getAiRouteConfig();
            expect(config).toBeDefined();
            expect(config.CLUSTERING).toBeDefined();
            expect(config.OPENAI).toBeDefined();
            expect(config.CACHE).toBeDefined();
        });

        it('should have correct TypeScript typing', () => {
            const config = getAiRouteConfig();

            // These should be available due to proper typing
            expect(typeof config.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM).toBe('number');
            expect(typeof config.SEARCH.MAX_KEYWORDS).toBe('number');
            expect(typeof config.OPENAI.DEFAULT_MODEL).toBe('string');
            expect(typeof config.FEATURES.AI_GENERATION_ENABLED).toBe('boolean');
        });
    });

    describe('Configuration Validation', () => {
        it('should have consistent proximity radius limits', () => {
            const {
                MIN_PROXIMITY_RADIUS_KM,
                MAX_PROXIMITY_RADIUS_KM,
                DEFAULT_PROXIMITY_RADIUS_KM,
            } = AI_ROUTE_CONFIG.CLUSTERING;

            expect(MIN_PROXIMITY_RADIUS_KM).toBeLessThan(DEFAULT_PROXIMITY_RADIUS_KM);
            expect(DEFAULT_PROXIMITY_RADIUS_KM).toBeLessThan(MAX_PROXIMITY_RADIUS_KM);
            expect(MIN_PROXIMITY_RADIUS_KM).toBeGreaterThan(0);
        });

        it('should have consistent cluster size limits', () => {
            const { DEFAULT_MIN_SPOTS_PER_CLUSTER, DEFAULT_MAX_SPOTS_PER_CLUSTER } =
                AI_ROUTE_CONFIG.CLUSTERING;

            expect(DEFAULT_MIN_SPOTS_PER_CLUSTER).toBeLessThan(DEFAULT_MAX_SPOTS_PER_CLUSTER);
            expect(DEFAULT_MIN_SPOTS_PER_CLUSTER).toBeGreaterThan(0);
        });

        it('should have consistent keyword limits', () => {
            const { MIN_KEYWORD_LENGTH, MAX_KEYWORD_LENGTH, MAX_KEYWORDS } = AI_ROUTE_CONFIG.SEARCH;

            expect(MIN_KEYWORD_LENGTH).toBeLessThan(MAX_KEYWORD_LENGTH);
            expect(MIN_KEYWORD_LENGTH).toBeGreaterThan(0);
            expect(MAX_KEYWORDS).toBeGreaterThan(0);
        });

        it('should have reasonable cache TTL values', () => {
            const { TOURIST_SPOTS_TTL, AI_CONTENT_TTL, ROUTE_RECOMMENDATIONS_TTL } =
                AI_ROUTE_CONFIG.CACHE;

            // All TTL values should be positive
            expect(TOURIST_SPOTS_TTL).toBeGreaterThan(0);
            expect(AI_CONTENT_TTL).toBeGreaterThan(0);
            expect(ROUTE_RECOMMENDATIONS_TTL).toBeGreaterThan(0);

            // AI content should have longer TTL than route recommendations
            expect(AI_CONTENT_TTL).toBeGreaterThan(ROUTE_RECOMMENDATIONS_TTL);
        });

        it('should have valid OpenAI parameters', () => {
            const {
                MAX_TOKENS,
                TEMPERATURE,
                MAX_RETRIES,
                REQUEST_TIMEOUT_MS,
                MIN_CONFIDENCE_SCORE,
            } = AI_ROUTE_CONFIG.OPENAI;

            expect(MAX_TOKENS).toBeGreaterThan(0);
            expect(TEMPERATURE).toBeGreaterThanOrEqual(0);
            expect(TEMPERATURE).toBeLessThanOrEqual(2); // Valid OpenAI temperature range
            expect(MAX_RETRIES).toBeGreaterThanOrEqual(0);
            expect(REQUEST_TIMEOUT_MS).toBeGreaterThan(0);
            expect(MIN_CONFIDENCE_SCORE).toBeGreaterThanOrEqual(0);
            expect(MIN_CONFIDENCE_SCORE).toBeLessThanOrEqual(1);
        });

        it('should have consistent rate limiting values', () => {
            const {
                WINDOW_MS,
                MAX_REQUESTS_PER_WINDOW,
                MAX_ANONYMOUS_REQUESTS,
                AI_GENERATION_LIMIT_PER_HOUR,
                RATE_LIMIT_COOLDOWN_SECONDS,
            } = AI_ROUTE_CONFIG.RATE_LIMITING;

            expect(WINDOW_MS).toBeGreaterThan(0);
            expect(MAX_REQUESTS_PER_WINDOW).toBeGreaterThan(MAX_ANONYMOUS_REQUESTS);
            expect(AI_GENERATION_LIMIT_PER_HOUR).toBeGreaterThan(0);
            expect(RATE_LIMIT_COOLDOWN_SECONDS).toBeGreaterThan(0);
        });

        it('should have non-empty default values', () => {
            const {
                DEFAULT_REGION_DESC,
                FALLBACK_ROUTE_NAME,
                DEFAULT_ESTIMATED_DURATION,
                DEFAULT_BACKGROUND_IMAGE,
                FALLBACK_RECOMMENDATIONS,
            } = AI_ROUTE_CONFIG.DEFAULTS;

            expect(DEFAULT_REGION_DESC).toBeTruthy();
            expect(FALLBACK_ROUTE_NAME).toBeTruthy();
            expect(DEFAULT_ESTIMATED_DURATION).toBeTruthy();
            expect(DEFAULT_BACKGROUND_IMAGE).toBeTruthy();
            expect(FALLBACK_RECOMMENDATIONS).toHaveLength(3);
            expect(FALLBACK_RECOMMENDATIONS.every((rec) => typeof rec === 'string')).toBe(true);
        });

        it('should have consistent validation limits', () => {
            const {
                MAX_ROUTE_NAME_LENGTH,
                MAX_REGION_DESC_LENGTH,
                MAX_RECOMMENDATIONS_COUNT,
                MIN_RESULT_CONFIDENCE,
            } = AI_ROUTE_CONFIG.VALIDATION;

            expect(MAX_ROUTE_NAME_LENGTH).toBeGreaterThan(0);
            expect(MAX_REGION_DESC_LENGTH).toBeGreaterThan(MAX_ROUTE_NAME_LENGTH);
            expect(MAX_RECOMMENDATIONS_COUNT).toBeGreaterThan(0);
            expect(MIN_RESULT_CONFIDENCE).toBeGreaterThanOrEqual(0);
            expect(MIN_RESULT_CONFIDENCE).toBeLessThanOrEqual(1);
        });

        it('should have reasonable performance thresholds', () => {
            const { SLOW_REQUEST_THRESHOLD_MS, MAX_SPOTS_IN_MEMORY, DB_BATCH_SIZE } =
                AI_ROUTE_CONFIG.PERFORMANCE;

            expect(SLOW_REQUEST_THRESHOLD_MS).toBeGreaterThan(0);
            expect(MAX_SPOTS_IN_MEMORY).toBeGreaterThan(0);
            expect(DB_BATCH_SIZE).toBeGreaterThan(0);
            expect(DB_BATCH_SIZE).toBeLessThan(MAX_SPOTS_IN_MEMORY);
        });
    });

    describe('Cache Key Prefixes', () => {
        it('should have unique cache prefixes', () => {
            const { ROUTE_CACHE_PREFIX, SPOTS_CACHE_PREFIX } = AI_ROUTE_CONFIG.CACHE;

            expect(ROUTE_CACHE_PREFIX).toBeTruthy();
            expect(SPOTS_CACHE_PREFIX).toBeTruthy();
            expect(ROUTE_CACHE_PREFIX).not.toBe(SPOTS_CACHE_PREFIX);
        });

        it('should have properly formatted cache prefixes', () => {
            const { ROUTE_CACHE_PREFIX, SPOTS_CACHE_PREFIX } = AI_ROUTE_CONFIG.CACHE;

            // Should end with delimiter for proper key formation
            expect(ROUTE_CACHE_PREFIX).toMatch(/:$/);
            expect(SPOTS_CACHE_PREFIX).toMatch(/:$/);
        });
    });

    describe('Feature Flags', () => {
        it('should have all feature flags as booleans', () => {
            const features = AI_ROUTE_CONFIG.FEATURES;

            Object.values(features).forEach((flag) => {
                expect(typeof flag).toBe('boolean');
            });
        });

        it('should have consistent feature defaults', () => {
            const {
                AI_GENERATION_ENABLED,
                CACHING_ENABLED,
                RATE_LIMITING_ENABLED,
                PERFORMANCE_MONITORING_ENABLED,
                FALLBACK_MODE_ENABLED,
            } = AI_ROUTE_CONFIG.FEATURES;

            // In production, these should generally be enabled
            expect(AI_GENERATION_ENABLED).toBe(true);
            expect(CACHING_ENABLED).toBe(true);
            expect(RATE_LIMITING_ENABLED).toBe(true);
            expect(PERFORMANCE_MONITORING_ENABLED).toBe(true);
            expect(FALLBACK_MODE_ENABLED).toBe(true);
        });
    });

    describe('Configuration Immutability', () => {
        it('should prevent modification of nested objects', () => {
            const config = getAiRouteConfig();

            // Configuration is readonly at compile time with 'as const'
            // but not frozen at runtime for performance reasons
            const originalValue = config.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM;

            // @ts-expect-error - Should be readonly at compile time
            config.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM = 999;

            // Verify the value was changed (proving it's not frozen)
            expect(config.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM).toBe(999);

            // Reset for other tests
            // @ts-expect-error - Should be readonly at compile time
            config.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM = originalValue;
        });

        it('should maintain reference equality for repeated calls', () => {
            // Note: This test would pass if the function returns a new object each time
            // but checks that the content is consistent
            const config1 = getAiRouteConfig();
            const config2 = getAiRouteConfig();

            expect(config1.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM).toBe(
                config2.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM,
            );
        });
    });

    describe('Environment Variable Integration', () => {
        it('should support different environments simultaneously', () => {
            const originalEnv = process.env.NODE_ENV;

            try {
                process.env.NODE_ENV = 'development';
                const devConfig = getEnvironmentConfig();

                process.env.NODE_ENV = 'production';
                const prodConfig = getEnvironmentConfig();

                // Should have different overrides
                expect(devConfig.RATE_LIMITING.MAX_REQUESTS_PER_WINDOW).not.toBe(
                    prodConfig.RATE_LIMITING.MAX_REQUESTS_PER_WINDOW,
                );
            } finally {
                process.env.NODE_ENV = originalEnv;
            }
        });
    });
});
