import { LocationInfo } from './location-info';

export interface LocationInfoRepository {
    /**
     * Get location info from Google Maps API
     * @param query - The query string to search for
     * @param latitude - The latitude of the location
     * @param longitude - The longitude of the location
     * @param address - The address of the location
     * @returns The location info
     */
    getLocationInfo(
        query: string,
        latitude?: number,
        longitude?: number,
        address?: string,
    ): Promise<LocationInfo>;
}
