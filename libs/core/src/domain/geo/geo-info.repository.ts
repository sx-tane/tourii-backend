import { GeoInfo } from './geo-info';

export interface GeoInfoRepository {
    /**
     * Get geo location info by tourist spot name
     * @param touristSpotName - Tourist spot name
     * @returns GeoInfo
     */
    getGeoLocationInfoByTouristSpotNameList(
        touristSpotNameList: string[],
    ): Promise<GeoInfo[]>;

    /**
     * Get region info by region name
     * @param regionName - Region name
     * @returns GeoInfo
     */
    getRegionInfoByRegionName(regionName: string): Promise<GeoInfo>;
}
