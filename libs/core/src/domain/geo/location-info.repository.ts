import { LocationInfo } from './location-info';

export interface LocationInfoRepository {
    getLocationInfo(query: string): Promise<LocationInfo>;
}
