import { TouriiBackendAppErrorType } from '@app/core';
import {
    CenterCoordinates,
    ClusteringOptions,
    TouristSpotCluster,
} from '@app/core/domain/ai-route/ai-route';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { CalculateDistanceUtil } from '@app/core/utils/calculate-distance.util';
import { CLUSTERING_DEFAULTS } from '../../domain/ai-route/ai-route-constants';
import { TouristSpot } from '../../domain/game/model-route/tourist-spot';
import { RegionDetectionUtil } from '../../utils/region-detection.util';

export class AiRouteClusteringRepositoryImpl {
    private static readonly DEFAULT_OPTIONS: ClusteringOptions = {
        proximityRadiusKm: CLUSTERING_DEFAULTS.PROXIMITY_RADIUS_KM,
        minSpotsPerCluster: CLUSTERING_DEFAULTS.MIN_SPOTS_PER_CLUSTER,
        maxSpotsPerCluster: CLUSTERING_DEFAULTS.MAX_SPOTS_PER_CLUSTER,
    };

    /**
     * Clusters tourist spots by geographic proximity
     * @param spots Array of tourist spots to cluster
     * @param options Clustering configuration options
     * @returns Array of tourist spot clusters
     */
    public static clusterTouristSpots(
        spots: TouristSpot[],
        options: Partial<ClusteringOptions> = {},
    ): TouristSpotCluster[] {
        const config = { ...AiRouteClusteringRepositoryImpl.DEFAULT_OPTIONS, ...options };

        // Filter out spots without valid coordinates
        const validSpots = spots.filter(
            (spot) =>
                spot.latitude !== undefined &&
                spot.longitude !== undefined &&
                spot.latitude !== 0 &&
                spot.longitude !== 0,
        );

        if (validSpots.length === 0) {
            return [];
        }

        const clusters: TouristSpotCluster[] = [];
        const processedSpots = new Set<string>();

        for (const spot of validSpots) {
            // Skip if spot already assigned to a cluster
            if (processedSpots.has(spot?.touristSpotId || '')) {
                continue;
            }

            // Find all nearby spots within the proximity radius
            const nearbySpots = AiRouteClusteringRepositoryImpl.findNearbySpots(
                spot,
                validSpots,
                config.proximityRadiusKm,
            );

            // Filter out already processed spots
            const availableNearbySpots = nearbySpots.filter(
                (nearbySpot) => !processedSpots.has(nearbySpot?.touristSpotId || ''),
            );

            // Only create cluster if we have enough spots
            if (availableNearbySpots.length >= config.minSpotsPerCluster) {
                // Limit cluster size
                const clusterSpots = availableNearbySpots.slice(0, config.maxSpotsPerCluster);

                const cluster = AiRouteClusteringRepositoryImpl.createCluster(clusterSpots);
                clusters.push(cluster);

                // Mark spots as processed
                clusterSpots.forEach((clusterSpot) => {
                    processedSpots.add(clusterSpot?.touristSpotId || '');
                });
            }
        }

        return clusters;
    }

    /**
     * Finds spots within proximity radius of a given spot
     * @param centerSpot - The spot to find nearby spots around
     * @param allSpots - All spots to search through
     * @param radiusKm - The radius in kilometers to search within
     * @returns An array of spots within the proximity radius
     */
    private static findNearbySpots(
        centerSpot: TouristSpot,
        allSpots: TouristSpot[],
        radiusKm: number,
    ): TouristSpot[] {
        const nearbySpots: TouristSpot[] = [];

        for (const spot of allSpots) {
            if (spot?.touristSpotId === centerSpot?.touristSpotId) {
                nearbySpots.push(spot); // Include the center spot itself
                continue;
            }

            const distance = CalculateDistanceUtil.calculateDistance(
                centerSpot?.latitude || 0,
                centerSpot?.longitude || 0,
                spot?.latitude || 0,
                spot?.longitude || 0,
            );

            if (distance <= radiusKm) {
                nearbySpots.push(spot);
            }
        }

        return nearbySpots;
    }

    /**
     * Creates a cluster from a group of tourist spots
     * @param spots - The tourist spots to cluster
     * @returns A cluster of tourist spots
     */
    private static createCluster(spots: TouristSpot[]): TouristSpotCluster {
        const centerCoordinates = AiRouteClusteringRepositoryImpl.calculateCenterCoordinates(spots);
        const region = RegionDetectionUtil.determineMostCommonRegion(spots);
        const averageDistance = AiRouteClusteringRepositoryImpl.calculateAverageDistance(
            spots,
            centerCoordinates,
        );

        return {
            id: AiRouteClusteringRepositoryImpl.generateClusterId(spots),
            spots,
            centerCoordinates,
            region,
            averageDistance,
        };
    }

    /**
     * Calculates the geographic center of a cluster
     * @param spots - The tourist spots to calculate the center of
     * @returns The geographic center of the cluster
     */
    private static calculateCenterCoordinates(spots: TouristSpot[]): { lat: number; lng: number } {
        const totalLat = spots.reduce((sum, spot) => sum + (spot?.latitude || 0), 0);
        const totalLng = spots.reduce((sum, spot) => sum + (spot?.longitude || 0), 0);

        return {
            lat: totalLat / spots.length,
            lng: totalLng / spots.length,
        };
    }

    /**
     * Calculates average distance from center for cluster compactness metric
     * @param spots - The tourist spots to calculate the average distance of
     * @param center - The geographic center of the cluster
     * @returns The average distance from the center of the cluster
     */
    private static calculateAverageDistance(
        spots: TouristSpot[],
        center: CenterCoordinates,
    ): number {
        const distances = spots.map((spot) =>
            CalculateDistanceUtil.calculateDistance(
                center.lat,
                center.lng,
                spot?.latitude || 0,
                spot?.longitude || 0,
            ),
        );

        return distances.reduce((sum, distance) => sum + distance, 0) / distances.length;
    }

    /**
     * Generates a unique ID for a cluster based on its spots
     */
    private static generateClusterId(spots: TouristSpot[]): string {
        const spotIds = spots
            .map((spot) => spot?.touristSpotId || '')
            .sort()
            .join('-');

        // Create a simple hash of the spot IDs
        let hash = 0;
        for (let i = 0; i < spotIds.length; i++) {
            const char = spotIds.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }

        return `cluster-${Math.abs(hash)}-${spots.length}spots`;
    }

    /**
     * Validates clustering options
     */
    public static validateOptions(options: Partial<ClusteringOptions>): ClusteringOptions {
        const validated = { ...AiRouteClusteringRepositoryImpl.DEFAULT_OPTIONS, ...options };

        if (validated.proximityRadiusKm <= 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_MR_016);
        }

        if (validated.minSpotsPerCluster <= 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_MR_017);
        }

        if (validated.maxSpotsPerCluster < validated.minSpotsPerCluster) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_MR_018);
        }

        return validated;
    }
}
