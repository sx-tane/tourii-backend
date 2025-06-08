import { LocationInfo } from '@app/core/domain/geo/location-info';
import { LocationInfoRepository } from '@app/core/domain/geo/location-info.repository';
import { CachingService } from '@app/core/provider/caching.service';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

const LOCATION_CACHE_PREFIX = 'location_info';
const CACHE_TTL_SECONDS = 86400; // 24 hours

@Injectable()
export class LocationInfoRepositoryApi implements LocationInfoRepository {
    constructor(
        private readonly httpService: TouriiBackendHttpService,
        private readonly configService: ConfigService,
        private readonly cachingService: CachingService,
    ) {}

    async getLocationInfo(query: string): Promise<LocationInfo> {
        const apiKey =
            this.configService.get<string>('GOOGLE_PLACES_API_KEY') ??
            this.configService.get<string>('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            Logger.error('GOOGLE_PLACES_API_KEY is not configured.');
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_005);
        }

        const cacheKey = `${LOCATION_CACHE_PREFIX}:${encodeURIComponent(query)}`;
        const fetchFn = async (): Promise<LocationInfo> => {
            try {
                const findUrl =
                    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}` +
                    `&inputtype=textquery&fields=place_id&key=${apiKey}`;
                const findRes = await firstValueFrom(
                    this.httpService.getTouriiBackendHttpService.get(findUrl),
                );
                const placeId = findRes.data?.candidates?.[0]?.place_id;
                if (!placeId) {
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_001);
                }

                const fields = [
                    'name',
                    'formatted_address',
                    'international_phone_number',
                    'website',
                    'rating',
                    'url',
                    'opening_hours',
                ].join(',');
                const detailUrl =
                    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}` +
                    `&fields=${fields}&key=${apiKey}`;
                const detailRes = await firstValueFrom(
                    this.httpService.getTouriiBackendHttpService.get(detailUrl),
                );
                const result = detailRes.data?.result;
                if (!result) {
                    throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_001);
                }

                return {
                    name: result.name ?? query,
                    formattedAddress: result.formatted_address,
                    phoneNumber: result.international_phone_number,
                    website: result.website,
                    rating: result.rating,
                    googleMapsUrl: result.url,
                    openingHours: result.opening_hours?.weekday_text,
                };
            } catch (error) {
                if (error instanceof TouriiBackendAppException) {
                    throw error;
                }
                Logger.error(`Failed to fetch location info for ${query}`, error);
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
            }
        };

        const data = await this.cachingService.getOrSet<LocationInfo>(
            cacheKey,
            fetchFn,
            CACHE_TTL_SECONDS,
        );
        if (!data) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
        }
        return data;
    }
}
