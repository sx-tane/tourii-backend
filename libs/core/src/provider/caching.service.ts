import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CachingService {
    private readonly logger = new Logger(CachingService.name);

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

            // 2. If cache miss or parse error, fetch from source
            this.logger.log(`Cache miss for key: ${key}. Fetching fresh data.`);
            const freshData = await fetchDataFn();

            // 3. Store fresh data in cache
            if (freshData !== null && freshData !== undefined) {
                // Avoid caching null/undefined explicitly
                try {
                    await this.cacheManager.set(
                        key,
                        JSON.stringify(freshData),
                        ttlSeconds * 1000, // Convert TTL to milliseconds
                    );
                    this.logger.log(
                        `Stored fresh data in cache with key: ${key}, TTL: ${ttlSeconds}s`,
                    );
                } catch (storeError) {
                    this.logger.error(`Failed to store data in cache for key ${key}:`, storeError);
                    // Still return fresh data even if caching fails
                }
            }

            return freshData;
        } catch (error) {
            this.logger.error(`Error in getOrSet for key ${key}:`, error);
            // Fallback: return null or rethrow, depending on desired behavior
            return null;
        }
    }

    /**
     * Invalidates (deletes) a cache entry by key.
     *
     * @param key The cache key to invalidate.
     */
    async invalidate(key: string): Promise<void> {
        try {
            await this.cacheManager.del(key);
            this.logger.log(`Cache invalidated for key: ${key}`);
        } catch (error) {
            this.logger.error(`Failed to invalidate cache for key ${key}:`, error);
            // Decide if you want to re-throw or just log
        }
    }
}
