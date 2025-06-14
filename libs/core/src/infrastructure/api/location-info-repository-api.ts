import { LocationImage, LocationInfo } from '@app/core/domain/geo/location-info';
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
const DEFAULT_PHOTO_MAX_WIDTH = 400; // Default thumbnail width
const DEFAULT_PHOTO_MAX_HEIGHT = 400; // Default thumbnail height
const MAX_PHOTOS = 3; // Maximum number of photos to fetch

@Injectable()
export class LocationInfoRepositoryApi implements LocationInfoRepository {
    constructor(
        private readonly httpService: TouriiBackendHttpService,
        private readonly configService: ConfigService,
        private readonly cachingService: CachingService,
    ) {}

    async getLocationInfo(
        query: string,
        latitude?: number,
        longitude?: number,
    ): Promise<LocationInfo> {
        const apiKey =
            this.configService.get<string>('GOOGLE_PLACES_API_KEY') ??
            this.configService.get<string>('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            Logger.error('GOOGLE_PLACES_API_KEY is not configured.');
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_005);
        }

        const cacheKey = `${LOCATION_CACHE_PREFIX}:${encodeURIComponent(
            query,
        )}:${latitude}:${longitude}`;
        const fetchFn = async (): Promise<LocationInfo> => {
            try {
                let findUrl =
                    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}` +
                    `&inputtype=textquery&fields=place_id&key=${apiKey}`;

                if (latitude !== undefined && longitude !== undefined) {
                    findUrl += `&locationbias=point:${latitude},${longitude}`;
                }

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
                    'photos',
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

                // Process photos if available
                const images = this.processPhotos(result.photos, apiKey);

                return {
                    name: result.name ?? query,
                    formattedAddress: result.formatted_address,
                    phoneNumber: result.international_phone_number,
                    website: result.website,
                    rating: result.rating,
                    googleMapsUrl: result.url,
                    openingHours: result.opening_hours?.weekday_text,
                    images,
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

    /**
     * Process photos from Google Places API response
     * @param photos Photo array from Google Places API
     * @param apiKey Google Places API key
     * @returns Array of LocationImage objects
     */
    private processPhotos(photos: any[], apiKey: string): LocationImage[] | undefined {
        if (!photos || !Array.isArray(photos) || photos.length === 0) {
            return undefined;
        }

        try {
            const processedImages: LocationImage[] = photos
                .slice(0, MAX_PHOTOS) // Limit number of photos
                .map((photo) => {
                    if (!photo.photo_reference) {
                        return null;
                    }

                    // Use photo dimensions if available, otherwise use defaults
                    const width = photo.width || DEFAULT_PHOTO_MAX_WIDTH;
                    const height = photo.height || DEFAULT_PHOTO_MAX_HEIGHT;

                    // Generate photo URL using Google Places Photos API
                    const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${DEFAULT_PHOTO_MAX_WIDTH}&maxheight=${DEFAULT_PHOTO_MAX_HEIGHT}&photoreference=${photo.photo_reference}&key=${apiKey}`;

                    return {
                        url: photoUrl,
                        width: Math.min(width, DEFAULT_PHOTO_MAX_WIDTH),
                        height: Math.min(height, DEFAULT_PHOTO_MAX_HEIGHT),
                        photoReference: photo.photo_reference,
                    };
                })
                .filter((image): image is LocationImage => image !== null);

            return processedImages.length > 0 ? processedImages : undefined;
        } catch (error) {
            Logger.warn(`Failed to process photos for location: ${error}`);
            return undefined;
        }
    }
}
