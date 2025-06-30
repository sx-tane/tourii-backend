import { ModelRouteEntity } from '@app/core';
import { Logger } from '@nestjs/common';

export enum RouteFilterMode {
    ALL = 'all',
    ANY = 'any',
}

export interface RouteFilterOptions {
    keywords: string[];
    mode: RouteFilterMode;
    maxRoutes?: number;
}

export class RouteFilter {
    /**
     * Filter routes by hashtags and region with performance optimizations
     * @param routes - The routes to filter
     * @param options - The filter options
     * @returns The filtered routes
     */
    static filterRoutesByHashtags(
        routes: ModelRouteEntity[],
        options: RouteFilterOptions,
    ): ModelRouteEntity[] {
        const startTime = Date.now();

        // Pre-filter by region first (most selective filter)
        const regionFiltered = RouteFilter.filterByRegion(routes);

        // Pre-compute hashtag sets for efficiency (avoid repeated string operations)
        const routesWithHashtagSets = RouteFilter.precomputeHashtagSets(regionFiltered);

        // Filter by hashtag matching with optimized algorithm
        const hashtagFiltered = RouteFilter.filterByHashtags(
            routesWithHashtagSets,
            options.keywords,
            options.mode,
        );

        // Apply limit
        const result = hashtagFiltered.slice(0, options.maxRoutes || 5);

        const processingTime = Date.now() - startTime;
        Logger.debug(`Route filtering completed`, {
            totalRoutes: routes.length,
            regionFiltered: regionFiltered.length,
            hashtagFiltered: hashtagFiltered.length,
            finalResult: result.length,
            processingTimeMs: processingTime,
        });

        return result;
    }

    /**
     * Filter routes by region
     * @param routes - The routes to filter
     * @param region - The region to filter by
     * @returns The filtered routes
     */
    private static filterByRegion(routes: ModelRouteEntity[]): ModelRouteEntity[] {
        return routes.filter((route) => {
            // Exclude AI-generated routes
            if (route.isAiGenerated) return false;

            // Region matching
            return route.region;
        });
    }

    /**
     * Pre-compute hashtag sets for each route to avoid repeated string operations
     * This optimization reduces complexity from O(n*m*k) to O(n*m) + O(n*k)
     * @param routes - The routes to pre-compute hashtag sets for
     * @returns The pre-computed hashtag sets
     */
    private static precomputeHashtagSets(routes: ModelRouteEntity[]): Array<{
        route: ModelRouteEntity;
        hashtagSet: Set<string>;
    }> {
        return routes
            .filter((route) => route.touristSpotList && route.touristSpotList.length > 0)
            .map((route) => {
                const hashtags = route.touristSpotList
                    ?.flatMap((spot) => spot.touristSpotHashtag || [])
                    .map((tag) => tag.toLowerCase());

                return {
                    route,
                    hashtagSet: new Set(hashtags),
                };
            });
    }

    /**
     * Optimized hashtag matching using Set operations for O(1) lookups
     * @param routesWithSets - The routes with pre-computed hashtag sets
     * @param keywords - The keywords to filter by
     * @param mode - The filter mode
     * @returns The filtered routes
     */
    private static filterByHashtags(
        routesWithSets: Array<{ route: ModelRouteEntity; hashtagSet: Set<string> }>,
        keywords: string[],
        mode: RouteFilterMode,
    ): ModelRouteEntity[] {
        const keywordsLower = keywords.map((k) => k.toLowerCase());

        return routesWithSets
            .filter(({ hashtagSet }) => {
                if (mode === RouteFilterMode.ALL) {
                    // All keywords must match at least one hashtag
                    return keywordsLower.every((keyword) =>
                        RouteFilter.hasMatchingHashtag(hashtagSet, keyword),
                    );
                } else {
                    // At least one keyword must match
                    return keywordsLower.some((keyword) =>
                        RouteFilter.hasMatchingHashtag(hashtagSet, keyword),
                    );
                }
            })
            .map(({ route }) => route);
    }

    /**
     * Check if a keyword matches any hashtag in the set
     * @param hashtagSet - The set of hashtags to check against
     * @param keyword - The keyword to check
     * @returns True if the keyword matches any hashtag, false otherwise
     */
    private static hasMatchingHashtag(hashtagSet: Set<string>, keyword: string): boolean {
        if (hashtagSet.has(keyword)) return true;

        for (const hashtag of hashtagSet) {
            if (hashtag.includes(keyword) || keyword.includes(hashtag)) {
                return true;
            }
        }
        return false;
    }
}
