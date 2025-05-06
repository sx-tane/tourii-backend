import { GeoInfo } from './geo-info';
import { WeatherInfo } from './weather-info';

export interface WeatherInfoRepository {
    /**
     * Get current weather by geo info list
     * @param geoInfoList - GeoInfo list
     * @returns WeatherInfo list
     */
    getCurrentWeatherByGeoInfoList(
        geoInfoList: GeoInfo[],
    ): Promise<WeatherInfo[]>;
}
