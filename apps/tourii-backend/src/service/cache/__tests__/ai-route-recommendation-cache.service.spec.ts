import { Test, TestingModule } from '@nestjs/testing';
import { createHash } from 'crypto';
import { AI_ROUTE_CONFIG } from '../../config/ai-route-recommendation.config';
import { AiRouteRecommendationCacheService } from '../ai-route-recommendation-cache.service';

describe('AiRouteRecommendationCacheService', () => {
    let service: AiRouteRecommendationCacheService;
    let mockCacheProvider: {
        get: jest.Mock;
        set: jest.Mock;
        del: jest.Mock;
        exists: jest.Mock;
    };

    const mockTouristSpotSearchRequest = {
        keywords: ['anime', 'culture'],
        mode: 'any' as const,
        region: 'Tokyo',
    };

    const mockTouristSpotSearchResult = {
        spots: [
            {
                touristSpotId: 'spot-1',
                touristSpotName: 'Anime Museum',
                touristSpotHashtag: ['anime', 'museum'],
                latitude: 35.6762,
                longitude: 139.6503,
            },
        ],
        searchTimestamp: '2025-01-01T00:00:00Z',
        totalFound: 1,
    };

    const mockAiContentRequest = {
        keywords: ['anime', 'culture'],
        spotNames: ['Anime Museum'],
        region: 'Tokyo',
        spotCount: 1,
    };

    const mockAiContentResult = {
        routeName: 'Anime Culture Adventure',
        regionDesc: 'Discover anime culture in Tokyo',
        recommendations: ['anime', 'culture', 'museum'],
        estimatedDuration: '1-2 days',
        confidenceScore: 0.85,
        generatedAt: '2025-01-01T00:00:00Z',
    };

    const mockRouteRecommendationRequest = {
        keywords: ['anime', 'culture'],
        mode: 'any' as const,
        region: 'Tokyo',
        proximityRadiusKm: 50,
        minSpotsPerCluster: 2,
        maxSpotsPerCluster: 8,
        maxRoutes: 5,
    };

    const mockRouteRecommendationResult = {
        generatedRoutes: [],
        summary: {
            totalSpotsFound: 1,
            clustersFormed: 1,
            routesGenerated: 1,
            processingTimeMs: 2500,
        },
        cachedAt: '2025-01-01T00:00:00Z',
    };

    beforeEach(async () => {
        mockCacheProvider = {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
            exists: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AiRouteRecommendationCacheService,
                {
                    provide: 'CacheOperations',
                    useValue: mockCacheProvider,
                },
            ],
        }).compile();

        service = new AiRouteRecommendationCacheService(mockCacheProvider);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('Tourist Spot Search Caching', () => {
        it('should cache tourist spot search results', async () => {
            await service.cacheTouristSpotSearch(
                mockTouristSpotSearchRequest,
                mockTouristSpotSearchResult,
            );

            expect(mockCacheProvider.set).toHaveBeenCalledWith(
                expect.stringContaining('spots-search:search:'),
                mockTouristSpotSearchResult,
                AI_ROUTE_CONFIG.CACHE.TOURIST_SPOTS_TTL,
            );
        });

        it('should retrieve cached tourist spot search results', async () => {
            mockCacheProvider.get.mockResolvedValue(mockTouristSpotSearchResult);

            const result = await service.getCachedTouristSpotSearch(mockTouristSpotSearchRequest);

            expect(mockCacheProvider.get).toHaveBeenCalledWith(
                expect.stringContaining('spots-search:search:'),
            );
            expect(result).toEqual(mockTouristSpotSearchResult);
        });

        it('should return null for cache miss', async () => {
            mockCacheProvider.get.mockResolvedValue(null);

            const result = await service.getCachedTouristSpotSearch(mockTouristSpotSearchRequest);

            expect(result).toBeNull();
        });

        it('should generate consistent cache keys for identical requests', async () => {
            const request1 = { keywords: ['a', 'b'], mode: 'any' as const };
            const request2 = { keywords: ['a', 'b'], mode: 'any' as const };

            await service.cacheTouristSpotSearch(request1, mockTouristSpotSearchResult);
            await service.getCachedTouristSpotSearch(request2);

            const setCalls = mockCacheProvider.set.mock.calls;
            const getCalls = mockCacheProvider.get.mock.calls;

            expect(setCalls[0][0]).toBe(getCalls[0][0]); // Same cache key
        });

        it('should generate different cache keys for different requests', async () => {
            const request1 = { keywords: ['a'], mode: 'any' as const };
            const request2 = { keywords: ['b'], mode: 'any' as const };

            await service.cacheTouristSpotSearch(request1, mockTouristSpotSearchResult);
            await service.cacheTouristSpotSearch(request2, mockTouristSpotSearchResult);

            const setCalls = mockCacheProvider.set.mock.calls;
            expect(setCalls[0][0]).not.toBe(setCalls[1][0]);
        });

        it('should handle cache errors gracefully for setting', async () => {
            mockCacheProvider.set.mockRejectedValue(new Error('Cache error'));
            const loggerSpy = jest.spyOn(service['logger'], 'warn');

            await service.cacheTouristSpotSearch(
                mockTouristSpotSearchRequest,
                mockTouristSpotSearchResult,
            );

            expect(loggerSpy).toHaveBeenCalledWith(
                'Failed to cache tourist spot search',
                expect.objectContaining({
                    error: 'Cache error',
                    request: mockTouristSpotSearchRequest,
                }),
            );
        });

        it('should handle cache errors gracefully for getting', async () => {
            mockCacheProvider.get.mockRejectedValue(new Error('Cache error'));
            const loggerSpy = jest.spyOn(service['logger'], 'warn');

            const result = await service.getCachedTouristSpotSearch(mockTouristSpotSearchRequest);

            expect(result).toBeNull();
            expect(loggerSpy).toHaveBeenCalledWith(
                'Failed to retrieve cached tourist spot search',
                expect.objectContaining({
                    error: 'Cache error',
                    request: mockTouristSpotSearchRequest,
                }),
            );
        });
    });

    describe('AI Content Caching', () => {
        it('should cache AI-generated content', async () => {
            await service.cacheAiContent(mockAiContentRequest, mockAiContentResult);

            expect(mockCacheProvider.set).toHaveBeenCalledWith(
                expect.stringContaining('ai-route:ai-content:'),
                mockAiContentResult,
                AI_ROUTE_CONFIG.CACHE.AI_CONTENT_TTL,
            );
        });

        it('should retrieve cached AI content', async () => {
            mockCacheProvider.get.mockResolvedValue(mockAiContentResult);

            const result = await service.getCachedAiContent(mockAiContentRequest);

            expect(mockCacheProvider.get).toHaveBeenCalledWith(
                expect.stringContaining('ai-route:ai-content:'),
            );
            expect(result).toEqual(mockAiContentResult);
        });

        it('should return null for AI content cache miss', async () => {
            mockCacheProvider.get.mockResolvedValue(null);

            const result = await service.getCachedAiContent(mockAiContentRequest);

            expect(result).toBeNull();
        });

        it('should log cache hits and misses for AI content', async () => {
            const loggerSpy = jest.spyOn(service['logger'], 'debug');

            // Test cache hit
            mockCacheProvider.get.mockResolvedValue(mockAiContentResult);
            await service.getCachedAiContent(mockAiContentRequest);

            expect(loggerSpy).toHaveBeenCalledWith(
                'Cache hit for AI content',
                expect.objectContaining({
                    key: expect.any(String),
                    routeName: mockAiContentResult.routeName,
                }),
            );

            // Test cache miss
            mockCacheProvider.get.mockResolvedValue(null);
            await service.getCachedAiContent(mockAiContentRequest);

            expect(loggerSpy).toHaveBeenCalledWith(
                'Cache miss for AI content',
                expect.objectContaining({
                    key: expect.any(String),
                }),
            );
        });
    });

    describe('Route Recommendation Caching', () => {
        it('should cache route recommendations', async () => {
            await service.cacheRouteRecommendations(
                mockRouteRecommendationRequest,
                mockRouteRecommendationResult,
            );

            expect(mockCacheProvider.set).toHaveBeenCalledWith(
                expect.stringContaining('ai-route:recommendations:'),
                mockRouteRecommendationResult,
                AI_ROUTE_CONFIG.CACHE.ROUTE_RECOMMENDATIONS_TTL,
            );
        });

        it('should retrieve cached route recommendations', async () => {
            mockCacheProvider.get.mockResolvedValue(mockRouteRecommendationResult);

            const result = await service.getCachedRouteRecommendations(
                mockRouteRecommendationRequest,
            );

            expect(result).toEqual(mockRouteRecommendationResult);
        });

        it('should use default values in cache key generation', async () => {
            const minimalRequest = {
                keywords: ['test'],
                mode: 'any' as const,
            };

            await service.cacheRouteRecommendations(minimalRequest, mockRouteRecommendationResult);

            // Should use defaults for missing values
            expect(mockCacheProvider.set).toHaveBeenCalledWith(
                expect.any(String),
                mockRouteRecommendationResult,
                AI_ROUTE_CONFIG.CACHE.ROUTE_RECOMMENDATIONS_TTL,
            );
        });
    });

    describe('Cache Key Generation', () => {
        it('should generate MD5 hashes for cache keys', async () => {
            const testRequest = { keywords: ['test'], mode: 'any' as const };

            await service.cacheTouristSpotSearch(testRequest, mockTouristSpotSearchResult);

            const cacheKey = mockCacheProvider.set.mock.calls[0][0];
            const hashPortion = cacheKey.split(':').pop();

            // Should be a valid MD5 hash (32 hexadecimal characters)
            expect(hashPortion).toMatch(/^[a-f0-9]{32}$/);
        });

        it('should sort keywords for consistent cache keys', async () => {
            const request1 = { keywords: ['b', 'a'], mode: 'any' as const };
            const request2 = { keywords: ['a', 'b'], mode: 'any' as const };

            await service.cacheTouristSpotSearch(request1, mockTouristSpotSearchResult);
            await service.cacheTouristSpotSearch(request2, mockTouristSpotSearchResult);

            const setCalls = mockCacheProvider.set.mock.calls;
            expect(setCalls[0][0]).toBe(setCalls[1][0]); // Same cache key
        });

        it('should include all parameters in route recommendation cache key', async () => {
            const fullRequest = {
                keywords: ['test'],
                mode: 'all' as const,
                region: 'Tokyo',
                proximityRadiusKm: 100,
                minSpotsPerCluster: 3,
                maxSpotsPerCluster: 10,
                maxRoutes: 8,
            };

            const minimalRequest = {
                keywords: ['test'],
                mode: 'all' as const,
            };

            await service.cacheRouteRecommendations(fullRequest, mockRouteRecommendationResult);
            await service.cacheRouteRecommendations(minimalRequest, mockRouteRecommendationResult);

            const setCalls = mockCacheProvider.set.mock.calls;
            expect(setCalls[0][0]).not.toBe(setCalls[1][0]); // Different cache keys
        });
    });

    describe('Cache Invalidation', () => {
        it('should support pattern-based cache invalidation', async () => {
            const loggerSpy = jest.spyOn(service['logger'], 'debug');

            await service.invalidateByPattern('test-pattern*');

            expect(loggerSpy).toHaveBeenCalledWith('Cache invalidation requested', {
                pattern: 'test-pattern*',
            });
        });

        it('should clear all caches', async () => {
            const loggerSpy = jest.spyOn(service['logger'], 'log');

            await service.clearAllCaches();

            expect(loggerSpy).toHaveBeenCalledWith('Cleared all AI route recommendation caches');
        });

        it('should handle cache invalidation errors', async () => {
            const loggerSpy = jest.spyOn(service['logger'], 'error');

            // Mock invalidateByPattern to throw an error
            jest.spyOn(service, 'invalidateByPattern').mockRejectedValue(
                new Error('Invalidation failed'),
            );

            await service.clearAllCaches();

            expect(loggerSpy).toHaveBeenCalledWith('Failed to clear all caches', {
                error: 'Invalidation failed',
            });
        });
    });

    describe('Feature Flag Handling', () => {
        it('should skip caching when CACHING_ENABLED is false', async () => {
            // Mock the config to disable caching
            jest.spyOn(AI_ROUTE_CONFIG.FEATURES, 'CACHING_ENABLED', 'get').mockReturnValue(false);

            await service.cacheTouristSpotSearch(
                mockTouristSpotSearchRequest,
                mockTouristSpotSearchResult,
            );

            expect(mockCacheProvider.set).not.toHaveBeenCalled();
        });

        it('should return null when caching is disabled for retrieval', async () => {
            jest.spyOn(AI_ROUTE_CONFIG.FEATURES, 'CACHING_ENABLED', 'get').mockReturnValue(false);

            const result = await service.getCachedTouristSpotSearch(mockTouristSpotSearchRequest);

            expect(result).toBeNull();
            expect(mockCacheProvider.get).not.toHaveBeenCalled();
        });
    });

    describe('Cache Statistics', () => {
        it('should return cache statistics', async () => {
            const stats = await service.getCacheStats();

            expect(stats).toEqual({
                enabled: AI_ROUTE_CONFIG.FEATURES.CACHING_ENABLED,
            });
        });

        it('should indicate when caching is disabled', async () => {
            jest.spyOn(AI_ROUTE_CONFIG.FEATURES, 'CACHING_ENABLED', 'get').mockReturnValue(false);

            const stats = await service.getCacheStats();

            expect(stats.enabled).toBe(false);
        });
    });

    describe('Performance Tests', () => {
        it('should generate cache keys quickly', async () => {
            const requests = Array.from({ length: 1000 }, (_, i) => ({
                keywords: [`keyword-${i}`],
                mode: 'any' as const,
            }));

            const startTime = Date.now();

            for (const request of requests) {
                await service.cacheTouristSpotSearch(request, mockTouristSpotSearchResult);
            }

            const endTime = Date.now();
            expect(endTime - startTime).toBeLessThan(1000); // Should complete in < 1 second
        });

        it('should handle large cache values efficiently', async () => {
            const largeResult = {
                ...mockTouristSpotSearchResult,
                spots: Array.from({ length: 1000 }, (_, i) => ({
                    touristSpotId: `spot-${i}`,
                    touristSpotName: `Spot ${i}`,
                    touristSpotHashtag: [`tag-${i}`, 'common'],
                    latitude: 35 + i * 0.01,
                    longitude: 139 + i * 0.01,
                })),
            };

            const startTime = Date.now();
            await service.cacheTouristSpotSearch(mockTouristSpotSearchRequest, largeResult);
            const endTime = Date.now();

            expect(endTime - startTime).toBeLessThan(100); // Should complete quickly
            expect(mockCacheProvider.set).toHaveBeenCalledWith(
                expect.any(String),
                largeResult,
                AI_ROUTE_CONFIG.CACHE.TOURIST_SPOTS_TTL,
            );
        });
    });

    describe('Edge Cases', () => {
        it('should handle empty keywords array', async () => {
            const emptyRequest = { keywords: [], mode: 'any' as const };

            await service.cacheTouristSpotSearch(emptyRequest, mockTouristSpotSearchResult);

            expect(mockCacheProvider.set).toHaveBeenCalled();
        });

        it('should handle undefined region', async () => {
            const requestWithoutRegion = {
                keywords: ['test'],
                mode: 'any' as const,
                region: undefined,
            };

            await service.cacheTouristSpotSearch(requestWithoutRegion, mockTouristSpotSearchResult);

            const cacheKey = mockCacheProvider.set.mock.calls[0][0];
            expect(cacheKey).toContain('all'); // Default region value
        });

        it('should handle special characters in keywords', async () => {
            const specialCharsRequest = {
                keywords: ['café', 'naïve', 'résumé'],
                mode: 'any' as const,
            };

            await service.cacheTouristSpotSearch(specialCharsRequest, mockTouristSpotSearchResult);

            expect(mockCacheProvider.set).toHaveBeenCalled();
        });

        it('should handle very long keywords', async () => {
            const longKeywordRequest = {
                keywords: ['a'.repeat(1000)],
                mode: 'any' as const,
            };

            await service.cacheTouristSpotSearch(longKeywordRequest, mockTouristSpotSearchResult);

            expect(mockCacheProvider.set).toHaveBeenCalled();
        });
    });

    describe('Concurrent Operations', () => {
        it('should handle concurrent cache operations', async () => {
            const requests = Array.from({ length: 10 }, (_, i) => ({
                keywords: [`keyword-${i}`],
                mode: 'any' as const,
            }));

            const promises = requests.map((request) =>
                service.cacheTouristSpotSearch(request, mockTouristSpotSearchResult),
            );

            await Promise.all(promises);

            expect(mockCacheProvider.set).toHaveBeenCalledTimes(10);
        });

        it('should handle concurrent cache retrievals', async () => {
            mockCacheProvider.get.mockResolvedValue(mockTouristSpotSearchResult);

            const requests = Array.from({ length: 10 }, (_, i) => ({
                keywords: [`keyword-${i}`],
                mode: 'any' as const,
            }));

            const promises = requests.map((request) => service.getCachedTouristSpotSearch(request));

            const results = await Promise.all(promises);

            expect(results).toHaveLength(10);
            expect(mockCacheProvider.get).toHaveBeenCalledTimes(10);
        });
    });
});
