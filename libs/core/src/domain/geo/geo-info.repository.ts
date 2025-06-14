import { GeoInfo } from './geo-info';

export interface GeoInfoRepository {
    /**
     * Get geo location info by tourist spot name
     * @param touristSpotNameList - Tourist spot names
     * @param addressList - Optional addresses for enhanced accuracy
     * @returns GeoInfo array
     */
    getGeoLocationInfoByTouristSpotNameList(
        touristSpotNameList: string[],
        addressList?: string[],
    ): Promise<GeoInfo[]>;

    /**
     * Get region info by region name
     * @param regionName - Region name
     * @param address - Optional address for enhanced accuracy
     * @returns GeoInfo
     */
    getRegionInfoByRegionName(regionName: string, address?: string): Promise<GeoInfo>;
}
