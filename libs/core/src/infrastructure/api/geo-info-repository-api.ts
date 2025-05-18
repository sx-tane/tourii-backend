import type { GeoInfo } from '@app/core/domain/geo/geo-info';
import type { GeoInfoRepository } from '@app/core/domain/geo/geo-info.repository';
import { CachingService } from '@app/core/provider/caching.service';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// Interface for the raw data returned by the helper
interface RawGeoData {
    latitude: number;
    longitude: number;
    formattedAddress: string;
}

// Define a specific cache key prefix for raw geo data
const GEO_DATA_RAW_CACHE_KEY_PREFIX = 'geo_data_raw';
const CACHE_TTL_SECONDS = 3600 * 24; // Cache for 24 hours, as geo data for a name is fairly static

@Injectable()
export class GeoInfoRepositoryApi implements GeoInfoRepository {
    constructor(
        private readonly touriiHttpService: TouriiBackendHttpService,
        private readonly configService: ConfigService,
        private readonly cachingService: CachingService,
    ) {}

    // --- Private Helper Method ---
    private async fetchSingleGeoInfoWithCache(name: string, apiKey: string): Promise<RawGeoData> {
        const cacheKey = `${GEO_DATA_RAW_CACHE_KEY_PREFIX}:${encodeURIComponent(name)}`;

        const fetchDataFn = async (): Promise<RawGeoData> => {
            const encodedName = encodeURIComponent(name);
            // TODO: Consider making the Google API URL configurable via ConfigService
            const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedName}&key=${apiKey}`;

            try {
                // TODO: Configure timeouts and retry mechanisms within TouriiBackendHttpService
                // or pass per-request timeout options if available.
                const response = await firstValueFrom(
                    this.touriiHttpService.getTouriiBackendHttpService.get(apiUrl, {
                        // Example: timeout: this.configService.get<number>('GEO_API_TIMEOUT', 5000),
                    }),
                );

                if (response.status === 200 && response.data?.results?.length > 0) {
                    const firstResult = response.data.results[0];
                    const location = firstResult.geometry?.location;
                    const formattedAddress = firstResult.formatted_address;

                    if (location?.lat && location?.lng && formattedAddress) {
                        return {
                            latitude: location.lat,
                            longitude: location.lng,
                            formattedAddress: formattedAddress,
                        };
                    }
                    Logger.warn(
                        `Missing location or formattedAddress in Google Geocoding API response for ${name}: ${JSON.stringify(firstResult)}`,
                    );
                    // Use a more specific error, though E_GEO_004 (External API Error) could also fit
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
                }

                // Handle Google API specific error statuses
                const googleApiStatus = response.data?.status;
                if (googleApiStatus === 'ZERO_RESULTS') {
                    Logger.warn(`Google Geocoding API returned ZERO_RESULTS for: ${name}`);
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_001);
                }
                if (googleApiStatus === 'REQUEST_DENIED') {
                    Logger.error(
                        `Google Geocoding API request denied for ${name}. Check API key and permissions. Data: ${JSON.stringify(response.data)}`,
                    );
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_002);
                }
                if (googleApiStatus === 'OVER_QUERY_LIMIT') {
                    Logger.error(
                        `Google Geocoding API OVER_QUERY_LIMIT for ${name}. Data: ${JSON.stringify(response.data)}`,
                    );
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_003);
                }

                Logger.warn(
                    `Unexpected response from Google Geocoding API for ${name}: Status ${response.status}, Google Status: ${googleApiStatus}, Data: ${JSON.stringify(response.data)}`,
                );
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
            } catch (error) {
                // Log the original error for debugging
                Logger.error(
                    `Failed to fetch geocoding info for ${name}: ${error instanceof Error ? error.message : String(error)}`,
                    error instanceof Error ? error.stack : undefined,
                );
                if (error instanceof TouriiBackendAppException) {
                    throw error; // Re-throw known Tourii exceptions
                }
                // Wrap unknown errors into a generic external API error for this context
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
            }
        };

        try {
            // Type assertion here is because our fetchDataFn is guaranteed to throw or return RawGeoData, not null.
            // If cachingService.getOrSet could return null even if fetchDataFn doesn't, this needs careful review of CachingService behavior.
            const cachedData = await this.cachingService.getOrSet<RawGeoData | null>(
                cacheKey,
                fetchDataFn,
                CACHE_TTL_SECONDS,
            );

            if (cachedData === null) {
                // This case should ideally not be reached if fetchDataFn always throws or returns RawGeoData.
                // However, to satisfy type checking and guard against unexpected nulls from cache layer:
                Logger.error(
                    `Geo data for ${name} resolved to null from cache/fetch function, which was not expected.`,
                );
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004); // Or E_TB_000
            }
            return cachedData;
        } catch (error) {
            // If cachingService.getOrSet fails (e.g. Redis unavailable), log and rethrow as an internal error
            // or a specific caching error type if available.
            Logger.error(
                `CachingService or fetchDataFn failed for geo data for ${name}: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
            );
            if (error instanceof TouriiBackendAppException) {
                throw error; // if fetchDataFn threw it and getOrSet rethrew
            }
            // Fallback to a generic internal error if caching layer itself fails
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
        }
    }

    // --- Public Methods ---

    async getGeoLocationInfoByTouristSpotNameList(
        touristSpotNameList: string[],
    ): Promise<GeoInfo[]> {
        const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            Logger.error('GOOGLE_MAPS_API_KEY is not configured.');
            // Use the new specific error
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_005);
        }

        // NOTE: This still makes concurrent requests for *unique* names not found in cache.
        // For a large number of unique names, consider using a library like 'p-limit'
        // to control concurrency and avoid overwhelming the external API or server resources.
        // Example: const limit = pLimit(5); // Limit to 5 concurrent requests
        // const geoInfoPromises = touristSpotNameList.map(name => limit(() => this.fetchSingleGeoInfoWithCache(name, apiKey)));
        // However, with caching, repeated calls for the same name will be served from cache quickly.

        try {
            const geoInfoPromises = touristSpotNameList.map(async (name) => {
                // Call the new method that includes caching
                const rawData = await this.fetchSingleGeoInfoWithCache(name, apiKey);
                return {
                    ...rawData,
                    touristSpotName: name,
                };
            });
            return await Promise.all(geoInfoPromises);
        } catch (error) {
            // Errors from fetchSingleGeoInfoWithCache (including TouriiBackendAppException) will propagate here if not caught by Promise.all
            // Or if Promise.all itself has an issue (less likely for typical errors from mapped promises)
            Logger.error(
                `One or more geo fetches failed for tourist spot list: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
            );
            if (error instanceof TouriiBackendAppException) {
                throw error; // Re-throw if it's already one of our application exceptions
            }
            // Fallback for unexpected errors during the Promise.all or mapping phase
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
        }
    }

    async getRegionInfoByRegionName(regionName: string): Promise<GeoInfo> {
        const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            Logger.error('GOOGLE_MAPS_API_KEY is not configured.');
            // Use the new specific error
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_005);
        }

        // This method will now benefit from the caching and improved error handling
        // in fetchSingleGeoInfoWithCache.
        const rawData = await this.fetchSingleGeoInfoWithCache(regionName, apiKey);
        return {
            ...rawData,
            touristSpotName: regionName, // Keep consistent with how GeoInfo is structured
        };
    }
}
