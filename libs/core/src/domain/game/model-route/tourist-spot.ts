import { RegionDetectionUtil } from '@app/core/utils/region-detection.util';
import { Logger } from '@nestjs/common';
import { REGION_FALLBACK_IMAGES } from '../../ai-route/ai-route-constants';
import { LocationInfoRepository } from '../../geo/location-info.repository';
import { ModelRouteRepository } from './model-route.repository';

interface TouristSpotProps {
    storyChapterId?: string;
    touristSpotId?: string;
    touristSpotName?: string;
    touristSpotDesc?: string;
    latitude?: number;
    longitude?: number;
    bestVisitTime?: string;
    address?: string;
    storyChapterLink?: string;
    touristSpotHashtag?: string[];
    imageSet?: { main: string; small: string[] };
    delFlag?: boolean;
    insUserId?: string;
    insDateTime?: Date;
    updUserId: string;
    updDateTime: Date;
    requestId?: string;
}

export class TouristSpot {
    private props: TouristSpotProps;

    constructor(props: TouristSpotProps) {
        this.props = props;
    }

    get storyChapterId(): string | undefined {
        return this.props.storyChapterId;
    }

    get touristSpotId(): string | undefined {
        return this.props.touristSpotId;
    }

    get touristSpotName(): string | undefined {
        return this.props.touristSpotName;
    }

    get touristSpotDesc(): string | undefined {
        return this.props.touristSpotDesc;
    }

    get latitude(): number | undefined {
        return this.props.latitude;
    }

    get longitude(): number | undefined {
        return this.props.longitude;
    }

    get bestVisitTime(): string | undefined {
        return this.props.bestVisitTime;
    }

    get address(): string | undefined {
        return this.props.address;
    }

    get storyChapterLink(): string | undefined {
        return this.props.storyChapterLink;
    }

    get touristSpotHashtag(): string[] | undefined {
        return this.props.touristSpotHashtag;
    }

    get imageSet(): { main: string; small: string[] } | undefined {
        return this.props.imageSet;
    }

    get delFlag(): boolean | undefined {
        return this.props.delFlag;
    }

    get insUserId(): string | undefined {
        return this.props.insUserId;
    }

    get insDateTime(): Date | undefined {
        return this.props.insDateTime;
    }

    get updUserId(): string {
        return this.props.updUserId;
    }

    get updDateTime(): Date {
        return this.props.updDateTime;
    }

    get requestId(): string | undefined {
        return this.props.requestId;
    }

    /**
     * Finds hashtags that appear in multiple spots within a cluster
     * @param spots - The spots to find common hashtags in
     * @returns The common hashtags
     */
    static findCommonHashtags(spots: Array<{ touristSpotHashtag?: string[] }>): string[] {
        // hashtagCounts is a map of hashtag to the number of spots that have that hashtag
        const hashtagCounts = new Map<string, number>();

        // Count the number of spots that have each hashtag
        spots.forEach((spot) => {
            const hashtags = spot.touristSpotHashtag || [];
            hashtags.forEach((tag) => {
                const normalized = tag.toLowerCase();
                hashtagCounts.set(normalized, (hashtagCounts.get(normalized) || 0) + 1);
            });
        });

        // Return hashtags that appear in at least 2 spots or 30% of spots
        const threshold = Math.max(2, Math.ceil(spots.length * 0.3));
        return Array.from(hashtagCounts.entries())
            .filter(([, count]) => count >= threshold)
            .sort(([, a], [, b]) => b - a)
            .map(([tag]) => tag)
            .slice(0, 5);
    }

    /**
     * Calculates fallback duration based on spot count
     * @param length - The number of spots in the cluster
     * @returns The fallback duration
     */
    static calculateDurationFallback(length: number): string {
        if (length <= 2) return '1 day';
        if (length <= 4) return '2 days';
        if (length <= 6) return '2-3 days';
        if (length <= 8) return '3-4 days';
        return '4-5 days';
    }

    /**
     * Gets real image from LocationInfo API for the first tourist spot in the route
     * @param spots - The spots to get the representative image from
     * @returns The representative image
     */
    static async selectRepresentativeImage(
        spots: TouristSpot[],
        locationInfoRepository: LocationInfoRepository,
        modelRouteRepository: ModelRouteRepository,
    ): Promise<string> {
        if (spots.length === 0) {
            return await TouristSpot.getFallbackImageForRegion(
                'Tohoku',
                locationInfoRepository,
                modelRouteRepository,
            );
        }

        const firstSpot = spots[0];

        // Try to get real image from LocationInfo API
        const realImage = await TouristSpot.tryGetRealImage(firstSpot, locationInfoRepository);
        if (realImage) {
            return realImage;
        }

        // Fallback to region-based image
        const region = RegionDetectionUtil.determineRegionFromSpot(firstSpot);
        return TouristSpot.getFallbackImageForRegion(
            region,
            locationInfoRepository,
            modelRouteRepository,
        );
    }

    /**
     * Gets fallback image for a region, trying LocationInfo API first, then curated images
     */
    private static async getFallbackImageForRegion(
        region: string,
        locationInfoRepository: LocationInfoRepository,
        modelRouteRepository: ModelRouteRepository,
    ): Promise<string> {
        Logger.debug(`Getting region fallback image for: ${region}`);

        // Try to get image from an existing route in the region
        const regionImage = await TouristSpot.tryGetRegionImageFromExistingRoute(
            region,
            modelRouteRepository,
            locationInfoRepository,
        );
        if (regionImage) {
            return regionImage;
        }

        const fallbackImage =
            REGION_FALLBACK_IMAGES[region as keyof typeof REGION_FALLBACK_IMAGES] ||
            REGION_FALLBACK_IMAGES.Tohoku;
        Logger.debug(`Using curated fallback image for ${region}: ${fallbackImage}`);
        return fallbackImage;
    }

    /**
     * Calculates a quality score for this tourist spot based on completeness and attributes
     * @param centerSpot Optional center spot for distance-based scoring
     * @returns Numeric score (higher is better)
     */
    calculateQualityScore(centerSpot?: TouristSpot): number {
        let score = 0;

        // Base score for having essential information
        if (this.touristSpotName?.trim()) {
            score += 10;
        }
        if (this.touristSpotDesc?.trim()) {
            score += 5;
        }

        // Hashtag diversity bonus (more hashtags = more discoverable)
        const hashtagCount = this.touristSpotHashtag?.length || 0;
        score += Math.min(hashtagCount * 2, 10); // Max 10 points for hashtags

        // Distance factor if center spot provided
        if (centerSpot && centerSpot.latitude && centerSpot.longitude) {
            const distance = this.calculateDistanceTo(centerSpot);
            // Subtract distance penalty (max 5 points penalty for 50km)
            score -= Math.min(distance / 10, 5);
        }

        // Media and completeness bonuses
        if (this.backgroundMedia?.trim()) {
            score += 5;
        }
        if (this.address?.trim()) {
            score += 3;
        }

        // Recent creation bonus
        if (this.insDateTime) {
            const daysSinceCreation = (Date.now() - new Date(this.insDateTime).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceCreation < 30) {
                score += 2;
            }
        }

        return Math.max(score, 0);
    }

    /**
     * Calculates distance to another tourist spot
     * @param otherSpot The other tourist spot
     * @returns Distance in kilometers
     */
    calculateDistanceTo(otherSpot: TouristSpot): number {
        if (!this.latitude || !this.longitude || !otherSpot.latitude || !otherSpot.longitude) {
            return Number.MAX_VALUE; // Invalid coordinates
        }

        return CalculateDistanceUtil.calculateDistance(
            this.latitude,
            this.longitude,
            otherSpot.latitude,
            otherSpot.longitude,
        );
    }

    /**
     * Selects the best tourist spots from a collection based on quality and criteria
     * @param spots Available spots to select from
     * @param maxCount Maximum number of spots to select
     * @param centerSpot Optional center spot for distance-based ranking
     * @returns Array of selected spots ordered by quality
     */
    static selectBestSpots(
        spots: TouristSpot[],
        maxCount: number,
        centerSpot?: TouristSpot,
    ): TouristSpot[] {
        if (spots.length <= maxCount) {
            return spots;
        }

        // Score and sort spots by quality
        const scoredSpots = spots
            .map((spot) => ({
                spot,
                score: spot.calculateQualityScore(centerSpot),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, maxCount);

        return scoredSpots.map((item) => item.spot);
    }

    /**
     * Tries to get a real image from the LocationInfo API
     * @param spot - The spot to get the real image from
     * @returns The real image
     */
    private static async tryGetRealImage(
        spot: TouristSpot,
        locationInfoRepository: LocationInfoRepository,
    ): Promise<string | null> {
        try {
            const realImage = await locationInfoRepository.getLocationImage(
                spot.touristSpotName || '',
                spot.latitude,
                spot.longitude,
                spot.address || undefined,
            );

            if (realImage) {
                Logger.debug(`Found real image for ${spot.touristSpotName}: ${realImage}`);
                return realImage;
            }

            return null;
        } catch (error) {
            Logger.warn(`Failed to get real image for ${spot.touristSpotName}:`, error);
            throw error;
        }
    }

    /**
     * Tries to get a region image from an existing route
     * @param region - The region to get the image from
     * @returns The region image
     */
    private static async tryGetRegionImageFromExistingRoute(
        region: string,
        modelRouteRepository: ModelRouteRepository,
        locationInfoRepository: LocationInfoRepository,
    ): Promise<string | null> {
        try {
            const routesInRegion = await modelRouteRepository.getModelRoutesByRegion(region);
            const firstRouteInRegion = routesInRegion[0];

            if (firstRouteInRegion?.touristSpotList?.length) {
                const firstSpotInRegion = firstRouteInRegion.touristSpotList[0];
                Logger.debug(
                    `Using first spot from existing route in ${region}: ${firstSpotInRegion.touristSpotName}`,
                );
                const regionImage = await locationInfoRepository.getLocationImage(
                    firstSpotInRegion.touristSpotName || '',
                    firstSpotInRegion.latitude,
                    firstSpotInRegion.longitude,
                    firstSpotInRegion.address || undefined,
                );

                if (regionImage) {
                    Logger.debug(`Found region image for ${region}: ${regionImage}`);
                    return regionImage;
                }
            }
            return null;
        } catch (error) {
            Logger.warn(`Failed to get region image for ${region}:`, error);
            return null;
        }
    }
}
