import type { GeoInfo } from '@app/core/domain/geo/geo-info';
import type { GeoInfoRepository } from '@app/core/domain/geo/geo-info.repository';
import { CachingService } from '@app/core/provider/caching.service';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

const GEO_INFO_CACHE_PREFIX = 'geo_info';
const CACHE_TTL_SECONDS = 3600 * 24; // Cache for 24 hours

@Injectable()
export class GeoInfoRepositoryApi implements GeoInfoRepository {
    constructor(
        private readonly touriiHttpService: TouriiBackendHttpService,
        private readonly configService: ConfigService,
        private readonly cachingService: CachingService,
    ) {}

    /**
     * Enhanced geocoding using name + address for better accuracy
     * @param name Place name
     * @param address Optional address for enhanced accuracy
     * @returns GeoInfo with coordinates and address
     */
    private async fetchSingleGeoInfo(name: string, address?: string): Promise<GeoInfo> {
        const cacheKey = `${GEO_INFO_CACHE_PREFIX}:${encodeURIComponent(name)}:${address ? encodeURIComponent(address) : ''}`;

        const fetchDataFn = async (): Promise<GeoInfo> => {
            const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
            if (!apiKey) {
                Logger.error('GOOGLE_MAPS_API_KEY is not configured.');
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_005);
            }

            // Try the new cost-optimized Places API first
            try {
                Logger.debug(`🚀 Trying cost-optimized Places API for geo: ${name}`);
                return await this.fetchGeoWithNewPlacesApi(name, address, apiKey);
            } catch (newApiError: unknown) {
                Logger.warn(
                    `⚠️ New Places API failed for geo "${name}": ${(newApiError as Error).message}`,
                );
                Logger.warn('🔄 Falling back to legacy Geocoding API');

                // Fallback to the original Geocoding API
                return await this.fetchGeoWithLegacyApi(name, address, apiKey);
            }
        };

        try {
            const cachedData = await this.cachingService.getOrSet<GeoInfo>(
                cacheKey,
                fetchDataFn,
                CACHE_TTL_SECONDS,
            );

            if (!cachedData) {
                Logger.error(`Geo data for "${name}" resolved to null from cache/fetch function`);
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
            }

            return cachedData;
        } catch (error) {
            Logger.error(`Failed to fetch geo info for "${name}": ${error}`);
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
        }
    }

    async getGeoLocationInfoByTouristSpotNameList(
        touristSpotNameList: string[],
        addressList?: string[],
    ): Promise<GeoInfo[]> {
        try {
            const geoInfoPromises = touristSpotNameList.map(async (name, index) => {
                const address = addressList?.[index];
                return await this.fetchSingleGeoInfo(name, address);
            });

            return await Promise.all(geoInfoPromises);
        } catch (error) {
            Logger.error(`One or more geo fetches failed for tourist spot list: ${error}`);
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
        }
    }

    async getRegionInfoByRegionName(regionName: string, address?: string): Promise<GeoInfo> {
        return await this.fetchSingleGeoInfo(regionName, address);
    }

    /**
     * 🚀 NEW: Cost-optimized geo lookup using Places API with minimal field mask
     */
    private async fetchGeoWithNewPlacesApi(
        name: string,
        address?: string,
        apiKey?: string,
    ): Promise<GeoInfo> {
        const searchQuery = address ? `${name} ${address}` : name;

        // Only request location and formatted address - this saves money!
        const fieldMask = 'places.location,places.formattedAddress';

        const requestBody = {
            textQuery: searchQuery,
        };

        const textSearchUrl = 'https://places.googleapis.com/v1/places:searchText';

        const response = await firstValueFrom(
            this.touriiHttpService.getTouriiBackendHttpService.post(textSearchUrl, requestBody, {
                headers: {
                    'X-Goog-Api-Key': apiKey,
                    'X-Goog-FieldMask': fieldMask,
                    'Content-Type': 'application/json',
                },
            }),
        );

        const places = response.data?.places;
        if (!places || places.length === 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_001);
        }

        const place = places[0];
        const location = place.location;
        const formattedAddress = place.formattedAddress;

        if (location?.latitude && location?.longitude) {
            Logger.debug(
                `Found coordinates for "${name}"${address ? ` with address "${address}"` : ''}: ${location.latitude}, ${location.longitude}`,
            );

            return {
                touristSpotName: name,
                latitude: location.latitude,
                longitude: location.longitude,
                formattedAddress: formattedAddress || `${name}, ${address || 'Unknown Location'}`,
            };
        }

        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
    }

    /**
     * 🔄 LEGACY: Original Geocoding API implementation as fallback
     */
    private async fetchGeoWithLegacyApi(
        name: string,
        address?: string,
        apiKey?: string,
    ): Promise<GeoInfo> {
        // Combine name and address for more precise search
        const searchQuery = address ? `${name} ${address}` : name;
        const encodedQuery = encodeURIComponent(searchQuery);
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedQuery}&key=${apiKey}`;

        const response = await firstValueFrom(
            this.touriiHttpService.getTouriiBackendHttpService.get(apiUrl),
        );

        if (response.status === 200 && response.data?.results?.length > 0) {
            const firstResult = response.data.results[0];
            const location = firstResult.geometry?.location;
            const formattedAddress = firstResult.formatted_address;

            if (location?.lat && location?.lng && formattedAddress) {
                Logger.debug(
                    `Found coordinates for "${name}"${address ? ` with address "${address}"` : ''}: ${location.lat}, ${location.lng}`,
                );
                return {
                    touristSpotName: name,
                    latitude: location.lat,
                    longitude: location.lng,
                    formattedAddress: formattedAddress,
                };
            }
        }

        const googleApiStatus = response.data?.status;
        if (googleApiStatus === 'ZERO_RESULTS') {
            Logger.warn(`Google Geocoding API returned ZERO_RESULTS for: "${searchQuery}"`);
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_001);
        }
        if (googleApiStatus === 'REQUEST_DENIED') {
            Logger.error(`Google Geocoding API request denied for "${searchQuery}"`);
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_002);
        }
        if (googleApiStatus === 'OVER_QUERY_LIMIT') {
            Logger.error(`Google Geocoding API OVER_QUERY_LIMIT for "${searchQuery}"`);
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_003);
        }

        Logger.warn(`Unexpected response from Google Geocoding API for "${searchQuery}"`);
        throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_GEO_004);
    }
}
