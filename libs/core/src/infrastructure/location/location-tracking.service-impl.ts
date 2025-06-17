import { Inject, Injectable, Logger } from '@nestjs/common';
import type { CheckInMethod } from '@prisma/client';
import * as ExifReader from 'exifreader';
import type { QuestRepository } from '../../domain/game/quest/quest.repository';
import type {
    AutoTravelLogRequest,
    LocationDetectionRequest,
    LocationDetectionResult,
    LocationTrackingService,
} from '../../domain/location/location-tracking.service';
import type { UserTravelLogRepository } from '../../domain/user/user-travel-log.repository';

@Injectable()
export class LocationTrackingServiceImpl implements LocationTrackingService {
    private readonly logger = new Logger(LocationTrackingServiceImpl.name);
    private readonly PROXIMITY_RADIUS_KM = 1.0; // 1km radius for auto-detection
    private readonly VALIDATION_DISTANCE_METERS = 500; // 500m for validation

    constructor(
        @Inject('USER_TRAVEL_LOG_REPOSITORY_TOKEN')
        private readonly userTravelLogRepository: UserTravelLogRepository,
        @Inject('QUEST_REPOSITORY_TOKEN')
        private readonly questRepository: QuestRepository,
    ) {}

    async detectLocationFromAPI(
        request: LocationDetectionRequest,
    ): Promise<LocationDetectionResult | null> {
        if (!request.latitude || !request.longitude) {
            return null;
        }

        try {
            // Find nearby tourist spots
            const nearbySpots = await this.findNearbyTouristSpots(
                request.latitude,
                request.longitude,
                this.PROXIMITY_RADIUS_KM,
            );

            if (nearbySpots.length === 0) {
                return null;
            }

            // Determine recommended check-in method based on API source
            const checkInMethod = this.determineCheckInMethod(request.apiSource);

            // Calculate confidence based on API source and proximity
            const confidence = this.calculateConfidence(request.apiSource, nearbySpots);

            return {
                detectedLocation: {
                    latitude: request.latitude,
                    longitude: request.longitude,
                },
                nearbyTouristSpots: nearbySpots,
                recommendedCheckInMethod: checkInMethod,
                confidence,
                source: request.apiSource || 'unknown',
            };
        } catch (error) {
            this.logger.error('Error detecting location from API', error);
            return null;
        }
    }

    async createAutoDetectedTravelLog(request: AutoTravelLogRequest): Promise<string> {
        const travelLogId = await this.userTravelLogRepository.createUserTravelLog({
            userId: request.userId,
            questId: request.questId,
            taskId: request.taskId,
            touristSpotId: request.touristSpotId,
            userLongitude: request.detectedLocation.longitude,
            userLatitude: request.detectedLocation.latitude,
            travelDistance: 0, // Will be calculated by repository
            checkInMethod: request.checkInMethod,
            qrCodeValue: undefined, // Not applicable for auto-detected
            detectedFraud: false,
            fraudReason: undefined,
            // Metadata could be stored in submission_data for user_task_log
        });

        this.logger.log(
            `Auto-detected travel log created: ${travelLogId} for user ${request.userId}`,
        );
        return travelLogId;
    }

    async findNearbyTouristSpots(
        latitude: number,
        longitude: number,
        radiusKm = this.PROXIMITY_RADIUS_KM,
    ): Promise<
        Array<{
            touristSpotId: string;
            distance: number;
            questId?: string;
            taskId?: string;
        }>
    > {
        try {
            // This would typically query the tourist spot and quest repositories
            // For now, return empty array as repositories need to be extended
            this.logger.log(
                `Searching for tourist spots near ${latitude}, ${longitude} within ${radiusKm}km`,
            );

            // TODO: Implement actual database query with spatial search
            // const touristSpots = await this.touristSpotRepository.findNearby(latitude, longitude, radiusKm);
            // const quests = await this.questRepository.findByTouristSpots(touristSpots.map(ts => ts.id));

            return [];
        } catch (error) {
            this.logger.error('Error finding nearby tourist spots', error);
            return [];
        }
    }

    async extractLocationFromPhoto(photoBuffer: Buffer): Promise<{
        latitude: number;
        longitude: number;
    } | null> {
        try {
            const tags = ExifReader.load(photoBuffer);

            if (tags.GPSLatitude && tags.GPSLongitude) {
                const latitude = this.convertDMSToDD(
                    tags.GPSLatitude.description,
                    tags.GPSLatitudeRef?.value as string,
                );
                const longitude = this.convertDMSToDD(
                    tags.GPSLongitude.description,
                    tags.GPSLongitudeRef?.value as string,
                );

                if (latitude !== null && longitude !== null) {
                    return { latitude, longitude };
                }
            }

            return null;
        } catch (error) {
            this.logger.error('Error extracting EXIF location data', error);
            return null;
        }
    }

    validateLocationProximity(
        userLat: number,
        userLng: number,
        targetLat: number,
        targetLng: number,
        maxDistanceMeters = this.VALIDATION_DISTANCE_METERS,
    ): { isValid: boolean; distance: number } {
        const distance = this.calculateDistance(userLat, userLng, targetLat, targetLng);
        const distanceMeters = distance * 1000; // Convert km to meters

        return {
            isValid: distanceMeters <= maxDistanceMeters,
            distance: distanceMeters,
        };
    }

    private determineCheckInMethod(apiSource?: string): CheckInMethod {
        switch (apiSource) {
            case 'photo_upload':
                return 'AUTO_DETECTED';
            case 'weather_api':
                return 'AUTO_DETECTED';
            case 'google_places':
                return 'AUTO_DETECTED';
            case 'manual_query':
                return 'GPS';
            case 'group_quest_start':
                return 'AUTO_DETECTED';
            case 'social_share':
                return 'AUTO_DETECTED';
            case 'quest_spot_query':
                return 'AUTO_DETECTED';
            default:
                return 'AUTO_DETECTED';
        }
    }

    private calculateConfidence(apiSource?: string, nearbySpots?: Array<any>): number {
        let baseConfidence = 0.5;

        // Adjust confidence based on API source
        switch (apiSource) {
            case 'photo_upload':
                baseConfidence = 0.9; // High confidence from EXIF data
                break;
            case 'google_places':
                baseConfidence = 0.8; // High confidence from place search
                break;
            case 'weather_api':
                baseConfidence = 0.6; // Medium confidence from weather query
                break;
            default:
                baseConfidence = 0.5;
        }

        // Adjust confidence based on proximity to tourist spots
        if (nearbySpots && nearbySpots.length > 0) {
            const closestDistance = Math.min(...nearbySpots.map((spot) => spot.distance));
            if (closestDistance < 0.1) {
                // Less than 100m
                baseConfidence += 0.2;
            } else if (closestDistance < 0.5) {
                // Less than 500m
                baseConfidence += 0.1;
            }
        }

        return Math.min(baseConfidence, 1.0);
    }

    private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const R = 6371; // Earth's radius in kilometers
        const dLat = this.degToRad(lat2 - lat1);
        const dLng = this.degToRad(lng2 - lng1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.degToRad(lat1)) *
                Math.cos(this.degToRad(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    private degToRad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    private convertDMSToDD(dmsString: string, direction: string): number | null {
        try {
            // Parse DMS format like "35° 39' 2.00""
            const matches = dmsString.match(/(\d+)°\s*(\d+)'\s*([\d.]+)"/);
            if (!matches) return null;

            const degrees = Number.parseInt(matches[1]);
            const minutes = Number.parseInt(matches[2]);
            const seconds = Number.parseFloat(matches[3]);

            let dd = degrees + minutes / 60 + seconds / 3600;

            // Apply direction
            if (direction === 'S' || direction === 'W') {
                dd = -dd;
            }

            return dd;
        } catch (error) {
            this.logger.error('Error converting DMS to DD', error);
            return null;
        }
    }
}
