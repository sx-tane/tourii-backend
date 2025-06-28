import { Injectable, Logger } from '@nestjs/common';
import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';

export interface RouteFilterOptions {
    keywords: string[];
    mode: 'all' | 'any';
    region?: string;
    maxRoutes?: number;
}

/**
 * Optimized route filtering service to extract complex filtering logic from controller
 * Addresses performance concerns with O(n²) operations
 */
@Injectable()
export class RouteFilterService {
    private readonly logger = new Logger(RouteFilterService.name);

    /**
     * Efficiently filter routes by hashtags and region with performance optimizations
     */
    filterRoutesByHashtags(
        routes: ModelRouteEntity[],
        options: RouteFilterOptions,
    ): ModelRouteEntity[] {
        const startTime = Date.now();
        
        // Pre-filter by region first (most selective filter)
        const regionFiltered = this.filterByRegion(routes, options.region);
        
        // Pre-compute hashtag sets for efficiency (avoid repeated string operations)
        const routesWithHashtagSets = this.precomputeHashtagSets(regionFiltered);
        
        // Filter by hashtag matching with optimized algorithm
        const hashtagFiltered = this.filterByHashtags(
            routesWithHashtagSets, 
            options.keywords, 
            options.mode
        );
        
        // Apply limit
        const result = hashtagFiltered.slice(0, options.maxRoutes || 5);
        
        const processingTime = Date.now() - startTime;
        this.logger.debug(`Route filtering completed`, {
            totalRoutes: routes.length,
            regionFiltered: regionFiltered.length,
            hashtagFiltered: hashtagFiltered.length,
            finalResult: result.length,
            processingTimeMs: processingTime,
        });

        return result;
    }

    /**
     * Filter routes by region (O(n) operation)
     */
    private filterByRegion(routes: ModelRouteEntity[], region?: string): ModelRouteEntity[] {
        if (!region) return routes;

        const regionLower = region.toLowerCase();
        return routes.filter((route) => {
            // Exclude AI-generated routes
            if (route.isAiGenerated) return false;
            
            // Region matching
            return route.region && route.region.toLowerCase().includes(regionLower);
        });
    }

    /**
     * Pre-compute hashtag sets for each route to avoid repeated string operations
     * This optimization reduces complexity from O(n*m*k) to O(n*m) + O(n*k)
     */
    private precomputeHashtagSets(routes: ModelRouteEntity[]): Array<{
        route: ModelRouteEntity;
        hashtagSet: Set<string>;
    }> {
        return routes
            .filter((route) => route.touristSpotList && route.touristSpotList.length > 0)
            .map((route) => {
                const hashtags = route.touristSpotList!
                    .flatMap((spot) => spot.touristSpotHashtag || [])
                    .map((tag) => tag.toLowerCase());
                
                return {
                    route,
                    hashtagSet: new Set(hashtags),
                };
            });
    }

    /**
     * Optimized hashtag matching using Set operations for O(1) lookups
     */
    private filterByHashtags(
        routesWithSets: Array<{ route: ModelRouteEntity; hashtagSet: Set<string> }>,
        keywords: string[],
        mode: 'all' | 'any',
    ): ModelRouteEntity[] {
        const keywordsLower = keywords.map((k) => k.toLowerCase());
        
        return routesWithSets
            .filter(({ hashtagSet }) => {
                if (mode === 'all') {
                    // All keywords must match at least one hashtag
                    return keywordsLower.every((keyword) =>
                        this.hasMatchingHashtag(hashtagSet, keyword)
                    );
                } else {
                    // At least one keyword must match
                    return keywordsLower.some((keyword) =>
                        this.hasMatchingHashtag(hashtagSet, keyword)
                    );
                }
            })
            .map(({ route }) => route);
    }

    /**
     * Optimized hashtag matching with substring search
     * Uses Set iteration which is more efficient than Array.some()
     */
    private hasMatchingHashtag(hashtagSet: Set<string>, keyword: string): boolean {
        // Direct match first (O(1))
        if (hashtagSet.has(keyword)) return true;
        
        // Substring matching (O(set size))
        for (const hashtag of hashtagSet) {
            if (hashtag.includes(keyword) || keyword.includes(hashtag)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Get statistics about route filtering for performance monitoring
     */
    getFilteringStats(routes: ModelRouteEntity[]): {
        totalRoutes: number;
        aiGeneratedRoutes: number;
        manualRoutes: number;
        routesWithSpots: number;
        totalHashtags: number;
        avgHashtagsPerRoute: number;
    } {
        const aiGenerated = routes.filter(r => r.isAiGenerated).length;
        const routesWithSpots = routes.filter(r => r.touristSpotList && r.touristSpotList.length > 0);
        const totalHashtags = routesWithSpots.reduce((sum, route) => {
            return sum + (route.touristSpotList?.flatMap(s => s.touristSpotHashtag || []).length || 0);
        }, 0);

        return {
            totalRoutes: routes.length,
            aiGeneratedRoutes: aiGenerated,
            manualRoutes: routes.length - aiGenerated,
            routesWithSpots: routesWithSpots.length,
            totalHashtags,
            avgHashtagsPerRoute: routesWithSpots.length > 0 ? totalHashtags / routesWithSpots.length : 0,
        };
    }
}