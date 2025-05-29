import type { GeoInfo } from '@app/core/domain/geo/geo-info';
import type { WeatherInfo } from '@app/core/domain/geo/weather-info';
import type { WeatherInfoRepository } from '@app/core/domain/geo/weather-info.repository';
import { CachingService } from '@app/core/provider/caching.service';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import {
    ApiAppError,
    TouriiBackendAppException,
} from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// Define a specific cache key prefix for raw weather data
const WEATHER_DATA_RAW_CACHE_KEY_PREFIX = 'weather_data_raw';
// Cache for 15 minutes (900 seconds), weather data changes frequently
// Make TTL configurable via environment variable
const DEFAULT_CACHE_TTL_SECONDS = 900;
// Add retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
// Rate limiting: max concurrent requests
const MAX_CONCURRENT_REQUESTS = 5;

@Injectable()
export class WeatherInfoRepositoryApi implements WeatherInfoRepository {
    private readonly logger = new Logger(WeatherInfoRepositoryApi.name);
    private readonly semaphore = new Map<string, Promise<WeatherInfo>>();

    constructor(
        private readonly touriiHttpService: TouriiBackendHttpService,
        private readonly configService: ConfigService,
        private readonly cachingService: CachingService,
    ) {}

    private async delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    private async fetchSingleWeatherInfoWithCache(
        geoInfo: GeoInfo,
        apiKey: string,
    ): Promise<WeatherInfo> {
        const { latitude, longitude, touristSpotName } = geoInfo;
        // Use a consistent cache key format with higher precision to avoid cache misses
        const cacheKey = `${WEATHER_DATA_RAW_CACHE_KEY_PREFIX}:${latitude.toFixed(6)}_${longitude.toFixed(6)}`;

        // Implement semaphore to prevent duplicate concurrent requests for the same location
        if (this.semaphore.has(cacheKey)) {
            this.logger.debug(`Reusing ongoing request for ${touristSpotName} (${cacheKey})`);
            return this.semaphore.get(cacheKey)!;
        }

        const fetchDataFn = async (): Promise<WeatherInfo> => {
            // TODO: Consider making the OpenWeatherMap API URL configurable via ConfigService
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

            let lastError: Error | null = null;

            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                try {
                    this.logger.debug(
                        `Weather API attempt ${attempt}/${MAX_RETRIES} for ${touristSpotName}`,
                    );

                    // Add delay between retries (except first attempt)
                    if (attempt > 1) {
                        await this.delay(RETRY_DELAY_MS * attempt);
                    }

                    // TODO: Configure timeouts and retry mechanisms within TouriiBackendHttpService
                    // or pass per-request timeout options if available.
                    const response = await firstValueFrom(
                        this.touriiHttpService.getTouriiBackendHttpService.get(apiUrl, {
                            timeout: this.configService.get<number>('WEATHER_API_TIMEOUT', 10000),
                        }),
                    );

                    // OpenWeatherMap specific error checks (even with HTTP 200, body can contain error code)
                    // https://openweathermap.org/faq#error401
                    if (response.data?.cod && String(response.data.cod) !== '200') {
                        const apiCode = String(response.data.cod);
                        const apiMessage =
                            response.data.message || 'Unknown OpenWeatherMap API error';
                        this.logger.warn(
                            `OpenWeatherMap API error for ${touristSpotName} (${latitude}, ${longitude}): Code ${apiCode}, Message: ${apiMessage}`,
                        );
                        if (apiCode === '401') {
                            // Unauthorized - invalid API key (don't retry)
                            throw new TouriiBackendAppException(
                                TouriiBackendAppErrorType.E_WEATHER_002,
                            );
                        }
                        if (apiCode === '404') {
                            // Not Found - wrong city, lat/lon, etc. (don't retry)
                            throw new TouriiBackendAppException(
                                TouriiBackendAppErrorType.E_WEATHER_001,
                            );
                        }
                        if (apiCode === '429') {
                            // Too many requests - retry with exponential backoff
                            if (attempt < MAX_RETRIES) {
                                this.logger.warn(
                                    `Rate limit hit for ${touristSpotName}, retrying in ${RETRY_DELAY_MS * attempt}ms`,
                                );
                                continue;
                            }
                            throw new TouriiBackendAppException(
                                TouriiBackendAppErrorType.E_WEATHER_003,
                            );
                        }
                        throw new TouriiBackendAppException(
                            TouriiBackendAppErrorType.E_WEATHER_004,
                        );
                    }

                    if (response.status === 200 && response.data?.list?.length > 0) {
                        const firstForecast = response.data.list[0];
                        const weather = firstForecast.weather?.[0];
                        const main = firstForecast.main;

                        if (weather && main) {
                            const weatherInfo = {
                                touristSpotName: touristSpotName,
                                temperatureCelsius: main.temp,
                                weatherName: weather.main,
                                weatherDesc: weather.description,
                            };
                            this.logger.debug(
                                `Successfully fetched weather for ${touristSpotName}: ${weather.main}, ${main.temp}°C`,
                            );
                            return weatherInfo;
                        }
                        this.logger.warn(
                            `Missing weather or main data in OpenWeather response for ${touristSpotName} (${latitude}, ${longitude}): ${JSON.stringify(firstForecast)}`,
                        );
                        if (attempt < MAX_RETRIES) continue; // Retry for malformed response
                        throw new TouriiBackendAppException(
                            TouriiBackendAppErrorType.E_WEATHER_004,
                        );
                    }

                    this.logger.warn(
                        `Unexpected OpenWeather API response structure for ${touristSpotName} (${latitude}, ${longitude}): Status ${response.status}, Data: ${JSON.stringify(response.data)}`,
                    );
                    if (attempt < MAX_RETRIES) continue; // Retry for unexpected response
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004);
                } catch (error) {
                    lastError = error instanceof Error ? error : new Error(String(error));

                    if (error instanceof TouriiBackendAppException) {
                        // Don't retry for known application errors (auth, not found, etc.)
                        const errorResponse = error.getResponse() as ApiAppError;
                        if (
                            errorResponse.code === 'E_WEATHER_001' ||
                            errorResponse.code === 'E_WEATHER_002'
                        ) {
                            throw error;
                        }
                        // Retry for other weather errors (rate limit, external API issues)
                        if (attempt < MAX_RETRIES) {
                            this.logger.warn(
                                `Weather API error for ${touristSpotName}, attempt ${attempt}/${MAX_RETRIES}: ${errorResponse.message}`,
                            );
                            continue;
                        }
                        throw error;
                    }

                    // Handle potential HTTP errors from axios
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const axiosError = error as any;
                    if (
                        axiosError.response?.status === 401 ||
                        axiosError.response?.status === 403
                    ) {
                        throw new TouriiBackendAppException(
                            TouriiBackendAppErrorType.E_WEATHER_002,
                        );
                    }
                    if (axiosError.response?.status === 404) {
                        throw new TouriiBackendAppException(
                            TouriiBackendAppErrorType.E_WEATHER_001,
                        );
                    }
                    if (axiosError.response?.status === 429) {
                        if (attempt < MAX_RETRIES) {
                            this.logger.warn(
                                `Rate limit (HTTP 429) for ${touristSpotName}, retrying in ${RETRY_DELAY_MS * attempt}ms`,
                            );
                            continue;
                        }
                        throw new TouriiBackendAppException(
                            TouriiBackendAppErrorType.E_WEATHER_003,
                        );
                    }

                    // For network errors, timeouts, etc., retry
                    if (attempt < MAX_RETRIES) {
                        this.logger.warn(
                            `Network error for ${touristSpotName}, attempt ${attempt}/${MAX_RETRIES}: ${lastError.message}`,
                        );
                        // Continue to next iteration (retry)
                    } else {
                        // All retries exhausted, break out of loop
                        break;
                    }
                }
            }

            // If we get here, all retries failed
            this.logger.error(
                `Failed fetching weather for ${touristSpotName} (${latitude}, ${longitude}) after ${MAX_RETRIES} attempts: ${lastError?.message}`,
                lastError?.stack,
            );
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004);
        };

        const requestPromise = (async (): Promise<WeatherInfo> => {
            try {
                const cacheTtl = this.configService.get<number>(
                    'WEATHER_CACHE_TTL_SECONDS',
                    DEFAULT_CACHE_TTL_SECONDS,
                );
                const cachedData = await this.cachingService.getOrSet<WeatherInfo | null>(
                    cacheKey,
                    fetchDataFn,
                    cacheTtl,
                );
                if (cachedData === null) {
                    this.logger.error(
                        `Weather data for ${touristSpotName} resolved to null from cache/fetch, not expected.`,
                    );
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004);
                }
                return cachedData;
            } catch (error) {
                this.logger.error(
                    `CachingService or fetchDataFn failed for weather data for ${touristSpotName} (${latitude}, ${longitude}): ${error instanceof Error ? error.message : String(error)}`,
                );
                if (error instanceof TouriiBackendAppException) {
                    throw error;
                }
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
            } finally {
                // Clean up semaphore
                this.semaphore.delete(cacheKey);
            }
        })();

        // Store the promise in semaphore to prevent duplicate requests
        this.semaphore.set(cacheKey, requestPromise);
        return requestPromise;
    }

    async getCurrentWeatherByGeoInfoList(geoInfoList: GeoInfo[]): Promise<WeatherInfo[]> {
        const apiKey = this.configService.get<string>('OPEN_WEATHER_API_KEY');
        if (!apiKey) {
            this.logger.error('OPEN_WEATHER_API_KEY is not configured.');
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_005);
        }

        this.logger.debug(`Fetching weather for ${geoInfoList.length} locations`);

        // Implement rate limiting by processing requests in batches
        const results: WeatherInfo[] = [];
        const batchSize = MAX_CONCURRENT_REQUESTS;

        for (let i = 0; i < geoInfoList.length; i += batchSize) {
            const batch = geoInfoList.slice(i, i + batchSize);
            this.logger.debug(
                `Processing weather batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(geoInfoList.length / batchSize)} (${batch.length} locations)`,
            );

            try {
                const batchPromises = batch.map((geoInfo) =>
                    this.fetchSingleWeatherInfoWithCache(geoInfo, apiKey),
                );

                const batchResults = await Promise.allSettled(batchPromises);

                // Process results and handle partial failures
                for (let j = 0; j < batchResults.length; j++) {
                    const result = batchResults[j];
                    const geoInfo = batch[j];

                    if (result.status === 'fulfilled') {
                        results.push(result.value);
                        this.logger.debug(
                            `Weather fetched successfully for ${geoInfo.touristSpotName}`,
                        );
                    } else {
                        this.logger.error(
                            `Weather fetch failed for ${geoInfo.touristSpotName}: ${result.reason instanceof Error ? result.reason.message : String(result.reason)}`,
                        );

                        // Re-throw the original error to maintain error handling behavior
                        if (result.reason instanceof TouriiBackendAppException) {
                            throw result.reason;
                        }
                        throw new TouriiBackendAppException(
                            TouriiBackendAppErrorType.E_WEATHER_004,
                        );
                    }
                }

                // Add delay between batches to respect rate limits
                if (i + batchSize < geoInfoList.length) {
                    await this.delay(200); // 200ms delay between batches
                }
            } catch (error) {
                this.logger.error(
                    `Batch weather fetch failed: ${error instanceof Error ? error.message : String(error)}`,
                    error instanceof Error ? error.stack : undefined,
                );
                if (error instanceof TouriiBackendAppException) {
                    throw error;
                }
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004);
            }
        }

        this.logger.debug(
            `Successfully fetched weather for ${results.length}/${geoInfoList.length} locations`,
        );
        return results;
    }
}
