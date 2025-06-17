import type { CheckInMethod } from '@prisma/client';

export interface LocationDetectionRequest {
    userId: string;
    latitude?: number;
    longitude?: number;
    apiSource?:
        | 'weather_api'
        | 'google_places'
        | 'photo_upload'
        | 'manual_query'
        | 'group_quest_start'
        | 'social_share'
        | 'quest_spot_query'
        | 'story_progress'
        | 'qr_scan';
    confidence?: number;
    metadata?: Record<string, any>;
}

export interface LocationDetectionResult {
    detectedLocation: {
        latitude: number;
        longitude: number;
    };
    nearbyTouristSpots: Array<{
        touristSpotId: string;
        distance: number;
        questId?: string;
        taskId?: string;
    }>;
    recommendedCheckInMethod: CheckInMethod;
    confidence: number;
    source: string;
}

export interface AutoTravelLogRequest {
    userId: string;
    questId: string;
    taskId: string;
    touristSpotId: string;
    detectedLocation: {
        latitude: number;
        longitude: number;
    };
    checkInMethod: CheckInMethod;
    apiSource: string;
    confidence: number;
    metadata?: Record<string, any>;
}

export abstract class LocationTrackingService {
    /**
     * Detect if user's location matches any tourist spots
     * and recommend automatic check-in
     */
    abstract detectLocationFromAPI(
        request: LocationDetectionRequest,
    ): Promise<LocationDetectionResult | null>;

    /**
     * Automatically create travel log when location is detected
     * through API usage
     */
    abstract createAutoDetectedTravelLog(request: AutoTravelLogRequest): Promise<string>;

    /**
     * Find nearby tourist spots within a given radius
     */
    abstract findNearbyTouristSpots(
        latitude: number,
        longitude: number,
        radiusKm?: number,
    ): Promise<
        Array<{
            touristSpotId: string;
            distance: number;
            questId?: string;
            taskId?: string;
        }>
    >;

    /**
     * Extract location from photo EXIF data
     */
    abstract extractLocationFromPhoto(photoBuffer: Buffer): Promise<{
        latitude: number;
        longitude: number;
    } | null>;

    /**
     * Validate if user is close enough to target location
     */
    abstract validateLocationProximity(
        userLat: number,
        userLng: number,
        targetLat: number,
        targetLng: number,
        maxDistanceMeters?: number,
    ): {
        isValid: boolean;
        distance: number;
    };
}
