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
const DEFAULT_PHOTO_MAX_WIDTH = 1920; // Increased from 400 for higher resolution
const DEFAULT_PHOTO_MAX_HEIGHT = 1080; // Increased from 400 for higher resolution
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
        address?: string,
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
        )}:${latitude}:${longitude}:${address || ''}`;
        const fetchFn = async (): Promise<LocationInfo> => {
            // Try the new cost-optimized Places API first
            try {
                Logger.debug(`🚀 Trying cost-optimized Places API for: ${query}`);
                return await this.fetchWithNewPlacesApi(
                    query,
                    latitude,
                    longitude,
                    address,
                    apiKey,
                );
            } catch (newApiError: unknown) {
                const errorMessage =
                    newApiError instanceof Error ? newApiError.message : 'Unknown error';
                Logger.warn(`⚠️ New Places API failed for "${query}": ${errorMessage}`);
                Logger.warn('🔄 Falling back to legacy API approach');

                // Fallback to the original working implementation
                return await this.fetchWithLegacyApi(query, latitude, longitude, address, apiKey);
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
     * 🚀 NEW: Cost-optimized Places API implementation with field masks
     * Uses single Text Search call instead of multiple API calls
     */
    private async fetchWithNewPlacesApi(
        query: string,
        latitude: number | undefined,
        longitude: number | undefined,
        address: string | undefined,
        apiKey: string,
    ): Promise<LocationInfo> {
        const searchQuery = address ? `${query} ${address}` : query;

        // Only request fields we actually need - saves money!
        const fieldMask =
            'places.displayName,places.formattedAddress,places.internationalPhoneNumber,places.websiteUri,places.rating,places.googleMapsUri,places.regularOpeningHours,places.photos';

        const requestBody: any = {
            textQuery: searchQuery,
        };

        // Add location bias if coordinates provided
        if (latitude !== undefined && longitude !== undefined) {
            requestBody.locationBias = {
                circle: {
                    center: { latitude, longitude },
                    radius: 5000, // 5km radius
                },
            };
        }

        const textSearchUrl = 'https://places.googleapis.com/v1/places:searchText';

        const response = await firstValueFrom(
            this.httpService.getTouriiBackendHttpService.post(textSearchUrl, requestBody, {
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

        // Process photos if available (generate direct URLs without additional API calls)
        const images = this.processNewApiPhotos(place.photos, apiKey);

        // Ensure backward compatibility with exact same format as legacy API
        return {
            name: place.displayName?.text ?? query,
            formattedAddress: place.formattedAddress ?? '',
            phoneNumber: place.internationalPhoneNumber ?? null,
            website: place.websiteUri ?? null,
            rating: place.rating ?? null,
            googleMapsUrl: place.googleMapsUri ?? null,
            // Convert new API format to legacy format for frontend compatibility
            openingHours: place.regularOpeningHours?.weekdayDescriptions ?? null,
            images: images ?? undefined,
        };
    }

    /**
     * 🔄 LEGACY: Original working implementation as fallback
     */
    private async fetchWithLegacyApi(
        query: string,
        latitude: number | undefined,
        longitude: number | undefined,
        address: string | undefined,
        apiKey: string,
    ): Promise<LocationInfo> {
        // Strategy 1: If we have lat/lng, use Nearby Search for high accuracy
        let placeId: string | undefined;

        if (latitude !== undefined && longitude !== undefined) {
            placeId = await this.findPlaceByNearbySearch(query, latitude, longitude, apiKey);
        }

        // Strategy 2: If nearby search failed or no coordinates, try enhanced text search
        if (!placeId) {
            placeId = await this.findPlaceByEnhancedTextSearch(
                query,
                address,
                latitude,
                longitude,
                apiKey,
            );
        }

        // Strategy 3: Fallback to basic text search
        if (!placeId) {
            placeId = await this.findPlaceByBasicTextSearch(query, latitude, longitude, apiKey);
        }

        if (!placeId) {
            Logger.warn(
                `No place found for query: "${query}", address: "${address}", lat: ${latitude}, lng: ${longitude}`,
            );
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
            formattedAddress: result.formatted_address ?? '',
            phoneNumber: result.international_phone_number ?? null,
            website: result.website ?? null,
            rating: result.rating ?? null,
            googleMapsUrl: result.url ?? null,
            openingHours: result.opening_hours?.weekday_text ?? null,
            images: images ?? undefined,
        };
    }

    /**
     * Process photos from new Places API response (generates direct URLs)
     */
    private processNewApiPhotos(photos: any[], apiKey: string): LocationImage[] | undefined {
        if (!photos || !Array.isArray(photos) || photos.length === 0) {
            return undefined;
        }

        try {
            const processedImages: LocationImage[] = photos
                .slice(0, MAX_PHOTOS) // Limit number of photos
                .map((photo) => {
                    if (!photo.name) {
                        return null;
                    }

                    // Use photo dimensions if available, otherwise use defaults
                    const width = photo.widthPx || DEFAULT_PHOTO_MAX_WIDTH;
                    const height = photo.heightPx || DEFAULT_PHOTO_MAX_HEIGHT;

                    // Generate direct photo URL using new Places API format (no additional API calls needed!)
                    const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?key=${apiKey}&maxHeightPx=${DEFAULT_PHOTO_MAX_HEIGHT}&maxWidthPx=${DEFAULT_PHOTO_MAX_WIDTH}`;

                    return {
                        url: photoUrl,
                        width: Math.min(width, DEFAULT_PHOTO_MAX_WIDTH),
                        height: Math.min(height, DEFAULT_PHOTO_MAX_HEIGHT),
                        photoReference: photo.name,
                    };
                })
                .filter((image): image is LocationImage => image !== null);

            return processedImages.length > 0 ? processedImages : undefined;
        } catch (error) {
            Logger.warn(`Failed to process photos for location: ${error}`);
            return undefined;
        }
    }

    /**
     * Strategy 1: Find place using Nearby Search API for high accuracy with coordinates
     * @param query Place name
     * @param latitude Latitude coordinate
     * @param longitude Longitude coordinate
     * @param apiKey Google Places API key
     * @returns Place ID if found
     */
    private async findPlaceByNearbySearch(
        query: string,
        latitude: number,
        longitude: number,
        apiKey: string,
    ): Promise<string | undefined> {
        try {
            const radius = 1000; // 1km radius - adjust as needed
            const nearbyUrl =
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}` +
                `&radius=${radius}&keyword=${encodeURIComponent(query)}&key=${apiKey}`;

            const nearbyRes = await firstValueFrom(
                this.httpService.getTouriiBackendHttpService.get(nearbyUrl),
            );

            const results = nearbyRes.data?.results;
            if (!results || results.length === 0) {
                Logger.debug(
                    `Nearby search found no results for "${query}" at ${latitude},${longitude}`,
                );
                return undefined;
            }

            // Find best match by name similarity and distance
            const bestMatch = this.findBestLocationMatch(results, query, latitude, longitude);
            if (bestMatch) {
                Logger.debug(
                    `Nearby search found match: "${bestMatch.name}" (place_id: ${bestMatch.place_id})`,
                );
                return bestMatch.place_id;
            }

            return undefined;
        } catch (error) {
            Logger.debug(`Nearby search failed for "${query}": ${error}`);
            return undefined;
        }
    }

    /**
     * Strategy 2: Enhanced text search using place name + address for better accuracy
     * @param query Place name
     * @param address Optional address
     * @param latitude Optional latitude for location bias
     * @param longitude Optional longitude for location bias
     * @param apiKey Google Places API key
     * @returns Place ID if found
     */
    private async findPlaceByEnhancedTextSearch(
        query: string,
        address: string | undefined,
        latitude: number | undefined,
        longitude: number | undefined,
        apiKey: string,
    ): Promise<string | undefined> {
        try {
            // Combine query with address for more precise search
            const enhancedQuery = address ? `${query} ${address}` : query;
            Logger.log(`Enhanced query: "${enhancedQuery}"`);

            let textSearchUrl =
                `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(enhancedQuery)}` +
                `&key=${apiKey}`;

            if (latitude !== undefined && longitude !== undefined) {
                textSearchUrl += `&location=${latitude},${longitude}&radius=5000`; // 5km radius for text search
            }

            const textRes = await firstValueFrom(
                this.httpService.getTouriiBackendHttpService.get(textSearchUrl),
            );

            const results = textRes.data?.results;
            if (!results || results.length === 0) {
                Logger.debug(`Enhanced text search found no results for "${enhancedQuery}"`);
                return undefined;
            }

            // Find best match
            const bestMatch = this.findBestLocationMatch(results, query, latitude, longitude);
            if (bestMatch) {
                Logger.debug(
                    `Enhanced text search found match: "${bestMatch.name}" (place_id: ${bestMatch.place_id})`,
                );
                return bestMatch.place_id;
            }

            return undefined;
        } catch (error) {
            Logger.debug(`Enhanced text search failed for "${query}": ${error}`);
            return undefined;
        }
    }

    /**
     * Strategy 3: Basic text search fallback (original implementation)
     * @param query Place name
     * @param latitude Optional latitude for location bias
     * @param longitude Optional longitude for location bias
     * @param apiKey Google Places API key
     * @returns Place ID if found
     */
    private async findPlaceByBasicTextSearch(
        query: string,
        latitude: number | undefined,
        longitude: number | undefined,
        apiKey: string,
    ): Promise<string | undefined> {
        try {
            let findUrl =
                `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}` +
                `&inputtype=textquery&fields=place_id,name,formatted_address,geometry&key=${apiKey}`;

            if (latitude !== undefined && longitude !== undefined) {
                findUrl += `&locationbias=point:${latitude},${longitude}`;
            }

            const findRes = await firstValueFrom(
                this.httpService.getTouriiBackendHttpService.get(findUrl),
            );

            const candidates = findRes.data?.candidates;
            if (!candidates || candidates.length === 0) {
                Logger.debug(`Basic text search found no results for "${query}"`);
                return undefined;
            }

            const candidate = candidates[0];
            if (candidate?.place_id) {
                Logger.debug(
                    `Basic text search found match: "${candidate.name}" (place_id: ${candidate.place_id})`,
                );
                return candidate.place_id;
            }

            return undefined;
        } catch (error) {
            Logger.debug(`Basic text search failed for "${query}": ${error}`);
            return undefined;
        }
    }

    /**
     * Find the best location match from search results
     * @param results Array of place results
     * @param targetName Target place name
     * @param targetLat Target latitude (optional)
     * @param targetLng Target longitude (optional)
     * @returns Best matching place result
     */
    private findBestLocationMatch(
        results: any[],
        targetName: string,
        targetLat?: number,
        targetLng?: number,
    ): any {
        if (!results || results.length === 0) return null;

        // If only one result, return it
        if (results.length === 1) return results[0];

        // Score each result
        const scoredResults = results.map((result) => {
            let score = 0;

            // Name similarity score (0-100)
            const nameScore = this.calculateNameSimilarity(result.name || '', targetName);
            score += nameScore * 0.7; // 70% weight for name similarity

            // Distance score (0-100) - if coordinates are provided
            if (targetLat !== undefined && targetLng !== undefined && result.geometry?.location) {
                const distance = this.calculateDistance(
                    targetLat,
                    targetLng,
                    result.geometry.location.lat,
                    result.geometry.location.lng,
                );
                // Convert distance to score (closer = higher score)
                const distanceScore = Math.max(0, 100 - distance / 100); // 100m = 1 point reduction
                score += distanceScore * 0.3; // 30% weight for distance
            }

            // Prefer higher rated places (if rating is available)
            if (result.rating) {
                score += (result.rating / 5) * 10; // Up to 10 bonus points for rating
            }

            return { ...result, score };
        });

        // Sort by score (highest first) and return the best match
        scoredResults.sort((a, b) => b.score - a.score);

        Logger.debug(
            `Best match for "${targetName}": "${scoredResults[0].name}" (score: ${scoredResults[0].score.toFixed(2)})`,
        );

        return scoredResults[0];
    }

    /**
     * Calculate name similarity between two strings (0-100)
     * @param name1 First name
     * @param name2 Second name
     * @returns Similarity score (0-100)
     */
    private calculateNameSimilarity(name1: string, name2: string): number {
        const normalize = (str: string) =>
            str
                .toLowerCase()
                .replace(/[^\w\s]/g, '')
                .trim();
        const n1 = normalize(name1);
        const n2 = normalize(name2);

        if (n1 === n2) return 100;
        if (n1.includes(n2) || n2.includes(n1)) return 80;

        // Levenshtein distance for more sophisticated matching
        const distance = this.levenshteinDistance(n1, n2);
        const maxLength = Math.max(n1.length, n2.length);
        return Math.max(0, ((maxLength - distance) / maxLength) * 100);
    }

    /**
     * Calculate Levenshtein distance between two strings
     * @param str1 First string
     * @param str2 Second string
     * @returns Distance
     */
    private levenshteinDistance(str1: string, str2: string): number {
        const matrix = [];
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1,
                    );
                }
            }
        }
        return matrix[str2.length][str1.length];
    }

    /**
     * Calculate distance between two points in meters
     * @param lat1 First latitude
     * @param lng1 First longitude
     * @param lat2 Second latitude
     * @param lng2 Second longitude
     * @returns Distance in meters
     */
    private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const R = 6371000; // Earth's radius in meters
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
                Math.cos((lat2 * Math.PI) / 180) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
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
