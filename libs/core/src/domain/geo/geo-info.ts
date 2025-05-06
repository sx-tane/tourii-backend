export interface GeoInfo {
    touristSpotName: string;
    latitude: number;
    longitude: number;
    formattedAddress: string;
}

export const isGeoInfoListUndefined = (geoInfoList: GeoInfo[] | undefined): boolean => {
    return !geoInfoList || geoInfoList.length === 0;
};
