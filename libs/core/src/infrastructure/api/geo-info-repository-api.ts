import type { GeoInfo } from '@app/core/domain/geo/geo-info';
import type { GeoInfoRepository } from '@app/core/domain/geo/geo-info.repository';
import { TouriiBackendHttpService } from '@app/core/provider/tourii-backend-http-service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

// Interface for the raw data returned by the helper
interface RawGeoData {
    latitude: number;
    longitude: number;
    formattedAddress: string;
}

@Injectable()
export class GeoInfoRepositoryApi implements GeoInfoRepository {
    constructor(
        private readonly touriiHttpService: TouriiBackendHttpService,
        private readonly configService: ConfigService,
    ) {}

    // --- Private Helper Method ---
    private async fetchSingleGeoInfo(name: string, apiKey: string): Promise<RawGeoData> {
        const encodedName = encodeURIComponent(name);
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedName}&key=${apiKey}`;

        try {
            const response = await firstValueFrom(
                this.touriiHttpService.getTouriiBackendHttpService.get(apiUrl),
            );

            if (response.status === 200 && response.data?.results?.length > 0) {
                const firstResult = response.data.results[0];
                const location = firstResult.geometry?.location;
                const formattedAddress = firstResult.formatted_address;

                if (location?.lat && location?.lng && formattedAddress) {
                    return {
                        latitude: location.lat,
                        longitude: location.lng,
                        formattedAddress: formattedAddress,
                    };
                }
                Logger.warn(
                    `Missing location or formattedAddress in Google Geocoding API response for ${name}: ${JSON.stringify(firstResult)}`,
                );
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
            }

            if (response.data?.status === 'ZERO_RESULTS') {
                Logger.warn(`Google Geocoding API returned ZERO_RESULTS for: ${name}`);
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
            }

            Logger.warn(
                `Unexpected response from Google Geocoding API for ${name}: Status ${response.status}, Data: ${JSON.stringify(response.data)}`,
            );
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
        } catch (error) {
            Logger.error(
                `Failed to fetch geocoding info for ${name}: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
            );
            if (error instanceof TouriiBackendAppException) {
                throw error; // Re-throw known exceptions
            }
            // Wrap unknown errors
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
        }
    }

    // --- Public Methods ---

    async getGeoLocationInfoByTouristSpotNameList(
        touristSpotNameList: string[],
    ): Promise<GeoInfo[]> {
        const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            Logger.error('GOOGLE_MAPS_API_KEY is not configured.');
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
        }

        try {
            const geoInfoPromises = touristSpotNameList.map(async (name) => {
                const rawData = await this.fetchSingleGeoInfo(name, apiKey);
                // Map raw data to the final GeoInfo structure for this list context
                return {
                    ...rawData,
                    touristSpotName: name,
                };
            });
            return await Promise.all(geoInfoPromises);
        } catch (error) {
            // Log error from Promise.all settling
            Logger.error(
                `One or more geo fetches failed for tourist spot list: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined,
            );
            // Ensure it's our exception type being thrown upwards
            if (error instanceof TouriiBackendAppException) {
                throw error;
            }
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
        }
    }

    async getRegionInfoByRegionName(regionName: string): Promise<GeoInfo> {
        const apiKey = this.configService.get<string>('GOOGLE_MAPS_API_KEY');
        if (!apiKey) {
            Logger.error('GOOGLE_MAPS_API_KEY is not configured.');
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_000);
        }

        // No try/catch needed here as fetchSingleGeoInfo handles/throws its own errors
        const rawData = await this.fetchSingleGeoInfo(regionName, apiKey);
        // Map raw data to the final GeoInfo structure for this single context
        return {
            ...rawData,
            touristSpotName: regionName,
        };
    }
}
