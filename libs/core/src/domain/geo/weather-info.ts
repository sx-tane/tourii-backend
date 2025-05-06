export interface WeatherInfo {
    touristSpotName: string;
    temperatureCelsius: number;
    weatherName: string;
    weatherDesc: string;
}

export const isWeatherResultUndefined = (weatherResult: WeatherInfo[] | undefined): boolean => {
    return !weatherResult || weatherResult.length === 0;
};
