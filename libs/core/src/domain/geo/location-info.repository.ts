import { LocationInfo } from './location-info';

export interface LocationInfoRepository {
    getLocationInfo(query: string, latitude?: number, longitude?: number): Promise<LocationInfo>;
}
