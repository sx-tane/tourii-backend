import type { GeoInfo } from '@app/core/domain/geo/geo-info';
import type { WeatherInfo } from '@app/core/domain/geo/weather-info';
import type { WeatherInfoRepository } from '@app/core/domain/geo/weather-info.repository';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WeatherInfoRepositoryApi implements WeatherInfoRepository {
    private readonly logger = new Logger(WeatherInfoRepositoryApi.name);

    constructor(
        private readonly touriiHttpService: TouriiBackendHttpService,
        private readonly configService: ConfigService,
    ) {}

    async getCurrentWeatherByGeoInfoList(geoInfoList: GeoInfo[]): Promise<WeatherInfo[]> {
        const apiKey = this.configService.get<string>('OPEN_WEATHER_API_KEY');
        if (!apiKey) {
            this.logger.error('OPEN_WEATHER_API_KEY is not configured.');
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
        }

        // Use Promise.all to fetch weather data concurrently
        try {
            const weatherInfoPromises = geoInfoList.map(async (geoInfo) => {
                const { latitude, longitude, touristSpotName } = geoInfo;
                const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

                try {
                    const response = await firstValueFrom(
                        this.touriiHttpService.getTouriiBackendHttpService.get(apiUrl),
                    );

                    // Check response and extract data from the first forecast item
                    if (
                        response.status === 200 &&
                        response.data?.cod === '200' &&
                        response.data?.list?.length > 0
                    ) {
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
                        // Log missing data within a successful response
                        this.logger.warn(
                            `Missing weather or main data in OpenWeather response for ${touristSpotName} (${latitude}, ${longitude}): ${JSON.stringify(firstForecast)}`,
                        );
                        // Decide how to handle: return null/undefined or throw for this specific item?
                        // Throwing ensures the Promise.all fails if any item is invalid.
                        throw new Error(`Incomplete weather data for ${touristSpotName}`);
                    }
                    // Log unexpected OpenWeather API response status or code
                    this.logger.warn(
                        `Unexpected OpenWeather API response for ${touristSpotName} (${latitude}, ${longitude}): Status ${response.status}, Data: ${JSON.stringify(response.data)}`,
                    );
                    throw new Error(`Unexpected API response for ${touristSpotName}`);
                } catch (error) {
                    this.logger.error(
                        `Failed fetching weather for ${touristSpotName} (${latitude}, ${longitude}): ${error instanceof Error ? error.message : String(error)}`,
                        error instanceof Error ? error.stack : undefined,
                    );
                    // Re-throw the error to make Promise.all fail
                    throw error;
                }
            });

            // Wait for all concurrent requests to complete
            const weatherInfoResults = await Promise.all(weatherInfoPromises);
            return weatherInfoResults; // Contains WeatherInfo objects
        } catch (error) {
            // Handle errors from Promise.all (e.g., if any individual request failed and threw)
            this.logger.error(
                `One or more weather fetches failed: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
            );
            // Wrap in application exception
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
        }
    }
}
