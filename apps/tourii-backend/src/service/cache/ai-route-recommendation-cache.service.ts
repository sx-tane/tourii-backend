import { Injectable, Logger, Inject } from '@nestjs/common';
import { createHash } from 'crypto';
import { AI_ROUTE_CONFIG } from '../config/ai-route-recommendation.config';

/**
 * Interface for cache operations
 */
interface CacheOperations {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
}

/**
 * Cache types for different AI route recommendation operations
 */
export interface TouristSpotSearchCache {
    spots: Array<{
        touristSpotId: string;
        touristSpotName: string;
        touristSpotHashtag: string[];
        latitude: number;
        longitude: number;
    }>;
    searchTimestamp: string;
    totalFound: number;
}

export interface AiContentGenerationCache {
    routeName: string;
    regionDesc: string;
    recommendations: string[];
    estimatedDuration: string;
    confidenceScore: number;
    generatedAt: string;
}

export interface RouteRecommendationCache {
    generatedRoutes: any[];
    summary: {
        totalSpotsFound: number;
        clustersFormed: number;
        routesGenerated: number;
        processingTimeMs: number;
    };
    cachedAt: string;
}

/**
 * Request interfaces for cache key generation
 */
export interface TouristSpotSearchRequest {
    keywords: string[];
    mode: 'all' | 'any';
    region?: string;
}

export interface AiContentGenerationRequest {
    keywords: string[];
    spotNames: string[];
    region: string;
    spotCount: number;
}

export interface RouteRecommendationRequest {
    keywords: string[];
    mode: 'all' | 'any';
    region?: string;
    proximityRadiusKm?: number;
    minSpotsPerCluster?: number;
    maxSpotsPerCluster?: number;
    maxRoutes?: number;
}

/**
 * Caching service for AI Route Recommendation system
 * Provides intelligent caching for expensive operations with proper cache key generation
 */
@Injectable()
export class AiRouteRecommendationCacheService {
    private readonly logger = new Logger(AiRouteRecommendationCacheService.name);
    private readonly config = AI_ROUTE_CONFIG.CACHE;

    constructor(@Inject('CacheOperations') private readonly cacheProvider: CacheOperations) {}

    /**
     * Cache tourist spot search results
     */
    async cacheTouristSpotSearch(
        request: TouristSpotSearchRequest,
        result: TouristSpotSearchCache,
    ): Promise<void> {
        if (!AI_ROUTE_CONFIG.FEATURES.CACHING_ENABLED) return;

        try {
            const key = this.generateTouristSpotSearchKey(request);
            await this.cacheProvider.set(key, result, this.config.TOURIST_SPOTS_TTL);

            this.logger.debug('Cached tourist spot search results', {
                key,
                spotCount: result.totalFound,
                ttl: this.config.TOURIST_SPOTS_TTL,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn('Failed to cache tourist spot search', {
                error: errorMessage,
                request,
            });
        }
    }

    /**
     * Retrieve cached tourist spot search results
     */
    async getCachedTouristSpotSearch(
        request: TouristSpotSearchRequest,
    ): Promise<TouristSpotSearchCache | null> {
        if (!AI_ROUTE_CONFIG.FEATURES.CACHING_ENABLED) return null;

        try {
            const key = this.generateTouristSpotSearchKey(request);
            const cached = await this.cacheProvider.get<TouristSpotSearchCache>(key);

            if (cached) {
                this.logger.debug('Cache hit for tourist spot search', { key });
                return cached;
            }

            this.logger.debug('Cache miss for tourist spot search', { key });
            return null;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn('Failed to retrieve cached tourist spot search', {
                error: errorMessage,
                request,
            });
            return null;
        }
    }

    /**
     * Cache AI-generated content
     */
    async cacheAiContent(
        request: AiContentGenerationRequest,
        result: AiContentGenerationCache,
    ): Promise<void> {
        if (!AI_ROUTE_CONFIG.FEATURES.CACHING_ENABLED) return;

        try {
            const key = this.generateAiContentKey(request);
            await this.cacheProvider.set(key, result, this.config.AI_CONTENT_TTL);

            this.logger.debug('Cached AI-generated content', {
                key,
                routeName: result.routeName,
                confidence: result.confidenceScore,
                ttl: this.config.AI_CONTENT_TTL,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn('Failed to cache AI content', {
                error: errorMessage,
                request,
            });
        }
    }

    /**
     * Retrieve cached AI-generated content
     */
    async getCachedAiContent(
        request: AiContentGenerationRequest,
    ): Promise<AiContentGenerationCache | null> {
        if (!AI_ROUTE_CONFIG.FEATURES.CACHING_ENABLED) return null;

        try {
            const key = this.generateAiContentKey(request);
            const cached = await this.cacheProvider.get<AiContentGenerationCache>(key);

            if (cached) {
                this.logger.debug('Cache hit for AI content', {
                    key,
                    routeName: cached.routeName,
                });
                return cached;
            }

            this.logger.debug('Cache miss for AI content', { key });
            return null;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn('Failed to retrieve cached AI content', {
                error: errorMessage,
                request,
            });
            return null;
        }
    }

    /**
     * Cache complete route recommendation results
     */
    async cacheRouteRecommendations(
        request: RouteRecommendationRequest,
        result: RouteRecommendationCache,
    ): Promise<void> {
        if (!AI_ROUTE_CONFIG.FEATURES.CACHING_ENABLED) return;

        try {
            const key = this.generateRouteRecommendationKey(request);
            await this.cacheProvider.set(key, result, this.config.ROUTE_RECOMMENDATIONS_TTL);

            this.logger.debug('Cached route recommendations', {
                key,
                routeCount: result.generatedRoutes.length,
                processingTime: result.summary.processingTimeMs,
                ttl: this.config.ROUTE_RECOMMENDATIONS_TTL,
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn('Failed to cache route recommendations', {
                error: errorMessage,
                request,
            });
        }
    }

    /**
     * Retrieve cached route recommendation results
     */
    async getCachedRouteRecommendations(
        request: RouteRecommendationRequest,
    ): Promise<RouteRecommendationCache | null> {
        if (!AI_ROUTE_CONFIG.FEATURES.CACHING_ENABLED) return null;

        try {
            const key = this.generateRouteRecommendationKey(request);
            const cached = await this.cacheProvider.get<RouteRecommendationCache>(key);

            if (cached) {
                this.logger.debug('Cache hit for route recommendations', {
                    key,
                    routeCount: cached.generatedRoutes.length,
                });
                return cached;
            }

            this.logger.debug('Cache miss for route recommendations', { key });
            return null;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn('Failed to retrieve cached route recommendations', {
                error: errorMessage,
                request,
            });
            return null;
        }
    }

    /**
     * Invalidate cache entries for specific patterns
     */
    async invalidateByPattern(pattern: string): Promise<void> {
        try {
            // This would need to be implemented based on your cache provider
            // For Redis, you could use SCAN with pattern matching
            this.logger.debug('Cache invalidation requested', { pattern });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.warn('Failed to invalidate cache by pattern', {
                error: errorMessage,
                pattern,
            });
        }
    }

    /**
     * Clear all AI route recommendation caches
     */
    async clearAllCaches(): Promise<void> {
        try {
            await Promise.all([
                this.invalidateByPattern(`${this.config.ROUTE_CACHE_PREFIX}*`),
                this.invalidateByPattern(`${this.config.SPOTS_CACHE_PREFIX}*`),
            ]);

            this.logger.log('Cleared all AI route recommendation caches');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error('Failed to clear all caches', { error: errorMessage });
        }
    }

    /**
     * Generate cache key for tourist spot searches
     */
    private generateTouristSpotSearchKey(request: TouristSpotSearchRequest): string {
        const normalized = {
            keywords: [...request.keywords].sort(), // Sort for consistent key
            mode: request.mode,
            region: request.region || 'all',
        };

        const hash = this.hashObject(normalized);
        return `${this.config.SPOTS_CACHE_PREFIX}search:${hash}`;
    }

    /**
     * Generate cache key for AI content generation
     */
    private generateAiContentKey(request: AiContentGenerationRequest): string {
        const normalized = {
            keywords: [...request.keywords].sort(),
            spotNames: [...request.spotNames].sort(),
            region: request.region,
            spotCount: request.spotCount,
        };

        const hash = this.hashObject(normalized);
        return `${this.config.ROUTE_CACHE_PREFIX}ai-content:${hash}`;
    }

    /**
     * Generate cache key for complete route recommendations
     */
    private generateRouteRecommendationKey(request: RouteRecommendationRequest): string {
        const normalized = {
            keywords: [...request.keywords].sort(),
            mode: request.mode,
            region: request.region || 'all',
            proximityRadiusKm:
                request.proximityRadiusKm || AI_ROUTE_CONFIG.CLUSTERING.DEFAULT_PROXIMITY_RADIUS_KM,
            minSpotsPerCluster:
                request.minSpotsPerCluster ||
                AI_ROUTE_CONFIG.CLUSTERING.DEFAULT_MIN_SPOTS_PER_CLUSTER,
            maxSpotsPerCluster:
                request.maxSpotsPerCluster ||
                AI_ROUTE_CONFIG.CLUSTERING.DEFAULT_MAX_SPOTS_PER_CLUSTER,
            maxRoutes: request.maxRoutes || AI_ROUTE_CONFIG.SEARCH.DEFAULT_MAX_ROUTES,
        };

        const hash = this.hashObject(normalized);
        return `${this.config.ROUTE_CACHE_PREFIX}recommendations:${hash}`;
    }

    /**
     * Create consistent hash for objects
     */
    private hashObject(obj: any): string {
        const str = JSON.stringify(obj);
        return createHash('md5').update(str).digest('hex');
    }

    /**
     * Get cache statistics (useful for monitoring)
     */
    async getCacheStats(): Promise<{
        enabled: boolean;
        hitRate?: number;
        totalKeys?: number;
    }> {
        return {
            enabled: AI_ROUTE_CONFIG.FEATURES.CACHING_ENABLED,
            // Additional stats would depend on cache provider capabilities
        };
    }
}
