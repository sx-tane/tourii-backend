import type { GeoInfo } from '@app/core/domain/geo/geo-info';
import type { WeatherInfo } from '@app/core/domain/geo/weather-info';
import type { WeatherInfoRepository } from '@app/core/domain/geo/weather-info.repository';
import { CachingService } from '@app/core/provider/caching.service';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// Define a specific cache key prefix for raw weather data
const WEATHER_DATA_RAW_CACHE_KEY_PREFIX = 'weather_data_raw';
// Cache for 15 minutes (900 seconds), weather data changes frequently
const CACHE_TTL_SECONDS = 900;

@Injectable()
export class WeatherInfoRepositoryApi implements WeatherInfoRepository {
    private readonly logger = new Logger(WeatherInfoRepositoryApi.name);

    constructor(
        private readonly touriiHttpService: TouriiBackendHttpService,
        private readonly configService: ConfigService,
        private readonly cachingService: CachingService,
    ) {}

    private async fetchSingleWeatherInfoWithCache(
        geoInfo: GeoInfo,
        apiKey: string,
    ): Promise<WeatherInfo> {
        const { latitude, longitude, touristSpotName } = geoInfo;
        // Use a consistent cache key format
        const cacheKey = `${WEATHER_DATA_RAW_CACHE_KEY_PREFIX}:${latitude.toFixed(4)}_${longitude.toFixed(4)}`;

        const fetchDataFn = async (): Promise<WeatherInfo> => {
            // TODO: Consider making the OpenWeatherMap API URL configurable via ConfigService
            const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

            try {
                // TODO: Configure timeouts and retry mechanisms within TouriiBackendHttpService
                // or pass per-request timeout options if available.
                const response = await firstValueFrom(
                    this.touriiHttpService.getTouriiBackendHttpService.get(apiUrl, {
                        // Example: timeout: this.configService.get<number>('WEATHER_API_TIMEOUT', 5000),
                    }),
                );

                // OpenWeatherMap specific error checks (even with HTTP 200, body can contain error code)
                // https://openweathermap.org/faq#error401
                if (response.data?.cod && String(response.data.cod) !== '200') {
                    const apiCode = String(response.data.cod);
                    const apiMessage = response.data.message || 'Unknown OpenWeatherMap API error';
                    this.logger.warn(
                        `OpenWeatherMap API error for ${touristSpotName} (${latitude}, ${longitude}): Code ${apiCode}, Message: ${apiMessage}`,
                    );
                    if (apiCode === '401') {
                        // Unauthorized - invalid API key
                        throw new TouriiBackendAppException(
                            TouriiBackendAppErrorType.E_WEATHER_002,
                        );
                    }
                    if (apiCode === '404') {
                        // Not Found - wrong city, lat/lon, etc.
                        throw new TouriiBackendAppException(
                            TouriiBackendAppErrorType.E_WEATHER_001,
                        );
                    }
                    if (apiCode === '429') {
                        // Too many requests (though this might also come as HTTP 429)
                        throw new TouriiBackendAppException(
                            TouriiBackendAppErrorType.E_WEATHER_003,
                        );
                    }
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004);
                }

                if (response.status === 200 && response.data?.list?.length > 0) {
                    const firstForecast = response.data.list[0];
                    const weather = firstForecast.weather?.[0];
                    const main = firstForecast.main;

                    if (weather && main) {
                        return {
                            touristSpotName: touristSpotName,
                            temperatureCelsius: main.temp,
                            weatherName: weather.main,
                            weatherDesc: weather.description,
                        };
                    }
                    this.logger.warn(
                        `Missing weather or main data in OpenWeather response for ${touristSpotName} (${latitude}, ${longitude}): ${JSON.stringify(firstForecast)}`,
                    );
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004); // External API error due to unexpected structure
                }

                this.logger.warn(
                    `Unexpected OpenWeather API response structure for ${touristSpotName} (${latitude}, ${longitude}): Status ${response.status}, Data: ${JSON.stringify(response.data)}`,
                );
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004);
            } catch (error) {
                this.logger.error(
                    `Failed fetching weather for ${touristSpotName} (${latitude}, ${longitude}): ${error instanceof Error ? error.message : String(error)}`,
                    error instanceof Error ? error.stack : undefined,
                );
                if (error instanceof TouriiBackendAppException) {
                    throw error; // Re-throw known Tourii exceptions
                }
                // Handle potential HTTP errors from axios if not transformed by TouriiBackendHttpService
                // For example, if axios throws an error for 4xx/5xx HTTP status codes.
                // This part might need adjustment based on how TouriiBackendHttpService handles HTTP errors.
                // Assuming it might throw an error with a response property:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const axiosError = error as any;
                if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_002);
                }
                if (axiosError.response?.status === 404) {
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_001);
                }
                if (axiosError.response?.status === 429) {
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_003);
                }
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004); // Default to general external API error
            }
        };

        try {
            const cachedData = await this.cachingService.getOrSet<WeatherInfo | null>(
                cacheKey,
                fetchDataFn,
                CACHE_TTL_SECONDS,
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
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000); // Fallback if caching layer fails
        }
    }

    async getCurrentWeatherByGeoInfoList(geoInfoList: GeoInfo[]): Promise<WeatherInfo[]> {
        const apiKey = this.configService.get<string>('OPEN_WEATHER_API_KEY');
        if (!apiKey) {
            this.logger.error('OPEN_WEATHER_API_KEY is not configured.');
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_005);
        }

        // NOTE: This still makes concurrent requests for *unique* geo coordinates not found in cache.
        // For a large number of unique locations, consider using a library like 'p-limit'
        // to control concurrency and avoid overwhelming the external API or server resources.
        try {
            const weatherInfoPromises = geoInfoList.map((geoInfo) =>
                this.fetchSingleWeatherInfoWithCache(geoInfo, apiKey),
            );

            return await Promise.all(weatherInfoPromises);
        } catch (error) {
            this.logger.error(
                `One or more weather fetches failed: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
            );
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            // Fallback for unexpected errors during Promise.all or mapping phase
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_WEATHER_004);
        }
    }
}
