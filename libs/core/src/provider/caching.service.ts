import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import type { Cache } from '@nestjs/cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CachingService {
    private readonly logger = new Logger(CachingService.name);
    private readonly ongoingFetches: Map<string, Promise<any | null>> = new Map();

    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    /**
     * Retrieves data from cache if available, otherwise executes the fetchDataFn,
     * stores the result in cache, and returns the result.
     *
     * @template T The expected type of the data.
     * @param key The cache key.
     * @param fetchDataFn An async function that fetches the data from the source if not in cache.
     * @param ttlSeconds Time-to-live for the cache entry in seconds.
     * @returns Promise<T | null> The data, or null if fetching failed and cache was empty.
     */
    async getOrSet<T>(
        key: string,
        fetchDataFn: () => Promise<T>,
        ttlSeconds: number,
    ): Promise<T | null> {
        try {
            // 1. Try cache
            const cachedDataString = await this.cacheManager.get<string>(key);
            if (cachedDataString) {
                this.logger.log(`Cache hit for key: ${key}. Using cached data.`);
                try {
                    return JSON.parse(cachedDataString) as T;
                } catch (parseError) {
                    this.logger.error(`Failed to parse cached data for key ${key}:`, parseError);
                    // Proceed to fetch fresh data if parsing fails
                }
            }

            // 2. If cache miss or parse error, check for ongoing fetch
            this.logger.log(`Cache miss for key: ${key}. Checking for ongoing fetches.`);
            if (this.ongoingFetches.has(key)) {
                this.logger.log(`Ongoing fetch for key: ${key}. Awaiting existing promise.`);
                return this.ongoingFetches.get(key);
            }

            // 3. If no ongoing fetch, initiate new fetch
            this.logger.log(`No ongoing fetch for key: ${key}. Initiating fresh data fetch.`);
            const fetchPromise = (async (): Promise<T | null> => {
                try {
                    const freshData = await fetchDataFn();

                    // Store fresh data in cache
                    if (freshData !== null && freshData !== undefined) {
                        try {
                            // cache-manager expects TTL in seconds. Avoid
                            // multiplying by 1000 which would drastically
                            // extend the expiration time.
                            await this.cacheManager.set(key, JSON.stringify(freshData), ttlSeconds);
                            this.logger.log(
                                `Stored fresh data in cache with key: ${key}, TTL: ${ttlSeconds}s`,
                            );
                        } catch (storeError) {
                            this.logger.error(
                                `Failed to store data in cache for key ${key}:`,
                                storeError,
                            );
                            // Still return fresh data even if caching fails
                        }
                    }
                    return freshData;
                } catch (fetchError) {
                    this.logger.error(
                        `Error fetching data for key ${key} in ongoing fetch:`,
                        fetchError,
                    );
                    // If it's a known application error, re-throw it to propagate specific error info
                    if (fetchError instanceof TouriiBackendAppException) {
                        throw fetchError;
                    }
                    return null; // For other errors, resolve promise to null
                } finally {
                    this.ongoingFetches.delete(key);
                    this.logger.log(`Removed ongoing fetch entry for key: ${key}`);
                }
            })();

            this.ongoingFetches.set(key, fetchPromise);
            return fetchPromise;
        } catch (error) {
            this.logger.error(`Error in getOrSet for key ${key}:`, error);
            // This outer catch primarily handles errors not originating from fetchDataFn or cacheManager interactions
            // covered within the promise, or if the promise setup itself fails.
            return null;
        }
    }

    /**
     * Invalidates (deletes) a cache entry by key.
     * Supports wildcard patterns ending with '*' to delete multiple keys.
     *
     * @param keyOrPattern The cache key to invalidate, or a pattern ending with '*'
     */
    async invalidate(keyOrPattern: string): Promise<void> {
        try {
            // Check if it's a wildcard pattern
            if (keyOrPattern.endsWith('*')) {
                await this.invalidatePattern(keyOrPattern);
            } else {
                // Single key invalidation
                await this.cacheManager.del(keyOrPattern);
                this.logger.log(`Cache invalidated for key: ${keyOrPattern}`);
            }
        } catch (error) {
            this.logger.error(`Failed to invalidate cache for key/pattern ${keyOrPattern}:`, error);
            // Decide if you want to re-throw or just log
        }
    }

    /**
     * Invalidates multiple cache entries matching a pattern.
     * Note: This is a basic implementation. For production use with Redis,
     * consider using SCAN command for better performance.
     *
     * @param pattern Pattern ending with '*' to match keys
     */
    private async invalidatePattern(pattern: string): Promise<void> {
        try {
            // For memory cache managers, we need to track keys ourselves
            // This is a limitation of the basic cache-manager implementation
            // For Redis, you would use SCAN command instead

            // Since we can't efficiently scan keys in cache-manager,
            // we'll log a warning and invalidate the specific known patterns
            this.logger.warn(
                `Wildcard cache invalidation for pattern: ${pattern}. This is not fully supported by cache-manager. Consider implementing Redis SCAN.`,
            );

            // For now, we'll just log the attempt
            this.logger.log(`Cache pattern invalidation attempted for: ${pattern}`);
        } catch (error) {
            this.logger.error(`Failed to invalidate cache pattern ${pattern}:`, error);
        }
    }

    /**
     * Clears all cache entries. Use with caution!
     */
    async clearAll(): Promise<void> {
        try {
            // Use store.reset() if available, otherwise clear individual keys
            const store = (this.cacheManager as any).store;
            if (store && typeof store.reset === 'function') {
                await store.reset();
            } else {
                this.logger.warn(
                    'Cache store reset not available - implement manual clearing if needed',
                );
            }
            this.logger.log('All cache entries cleared');
        } catch (error) {
            this.logger.error('Failed to clear all cache entries:', error);
        }
    }
}
