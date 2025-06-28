import { TouristSpot } from '../../domain/game/model-route/tourist-spot';
import { CLUSTERING_DEFAULTS } from '../../domain/ai-route/ai-route-constants';
import { RegionDetectionUtil } from '../../utils/region-detection.util';

export interface TouristSpotCluster {
    id: string;
    spots: TouristSpot[];
    centerCoordinates: {
        lat: number;
        lng: number;
    };
    region: string;
    averageDistance: number;
}

export interface ClusteringOptions {
    proximityRadiusKm: number;
    minSpotsPerCluster: number;
    maxSpotsPerCluster: number;
}

export class AiRouteClusteringService {
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
        const config = { ...AiRouteClusteringService.DEFAULT_OPTIONS, ...options };

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
            if (processedSpots.has(spot.touristSpotId!)) {
                continue;
            }

            // Find all nearby spots within the proximity radius
            const nearbySpots = AiRouteClusteringService.findNearbySpots(
                spot,
                validSpots,
                config.proximityRadiusKm,
            );

            // Filter out already processed spots
            const availableNearbySpots = nearbySpots.filter(
                (nearbySpot) => !processedSpots.has(nearbySpot.touristSpotId!),
            );

            // Only create cluster if we have enough spots
            if (availableNearbySpots.length >= config.minSpotsPerCluster) {
                // Limit cluster size
                const clusterSpots = availableNearbySpots.slice(0, config.maxSpotsPerCluster);

                const cluster = AiRouteClusteringService.createCluster(clusterSpots);
                clusters.push(cluster);

                // Mark spots as processed
                clusterSpots.forEach((clusterSpot) => {
                    processedSpots.add(clusterSpot.touristSpotId!);
                });
            }
        }

        return clusters;
    }

    /**
     * Finds spots within proximity radius of a given spot
     */
    private static findNearbySpots(
        centerSpot: TouristSpot,
        allSpots: TouristSpot[],
        radiusKm: number,
    ): TouristSpot[] {
        const nearbySpots: TouristSpot[] = [];

        for (const spot of allSpots) {
            if (spot.touristSpotId === centerSpot.touristSpotId) {
                nearbySpots.push(spot); // Include the center spot itself
                continue;
            }

            const distance = AiRouteClusteringService.calculateDistance(
                centerSpot.latitude!,
                centerSpot.longitude!,
                spot.latitude!,
                spot.longitude!,
            );

            if (distance <= radiusKm) {
                nearbySpots.push(spot);
            }
        }

        return nearbySpots;
    }

    /**
     * Creates a cluster from a group of tourist spots
     */
    private static createCluster(spots: TouristSpot[]): TouristSpotCluster {
        const centerCoordinates = AiRouteClusteringService.calculateCenterCoordinates(spots);
        const region = AiRouteClusteringService.determineClusterRegion(spots);
        const averageDistance = AiRouteClusteringService.calculateAverageDistance(
            spots,
            centerCoordinates,
        );

        return {
            id: AiRouteClusteringService.generateClusterId(spots),
            spots,
            centerCoordinates,
            region,
            averageDistance,
        };
    }

    /**
     * Calculates the geographic center of a cluster
     */
    private static calculateCenterCoordinates(spots: TouristSpot[]): { lat: number; lng: number } {
        const totalLat = spots.reduce((sum, spot) => sum + spot.latitude!, 0);
        const totalLng = spots.reduce((sum, spot) => sum + spot.longitude!, 0);

        return {
            lat: totalLat / spots.length,
            lng: totalLng / spots.length,
        };
    }

    /**
     * Determines the primary region for a cluster based on tourist spot hashtags
     * Uses the shared RegionDetectionUtil for consistency
     */
    private static determineClusterRegion(spots: TouristSpot[]): string {
        return RegionDetectionUtil.determineMostCommonRegion(spots);
    }


    /**
     * Calculates average distance from center for cluster compactness metric
     */
    private static calculateAverageDistance(
        spots: TouristSpot[],
        center: { lat: number; lng: number },
    ): number {
        const distances = spots.map((spot) =>
            AiRouteClusteringService.calculateDistance(
                center.lat,
                center.lng,
                spot.latitude!,
                spot.longitude!,
            ),
        );

        return distances.reduce((sum, distance) => sum + distance, 0) / distances.length;
    }

    /**
     * Generates a unique ID for a cluster based on its spots
     */
    private static generateClusterId(spots: TouristSpot[]): string {
        const spotIds = spots
            .map((spot) => spot.touristSpotId!)
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
     * Calculates the great circle distance between two points using Haversine formula
     * @param lat1 Latitude of first point
     * @param lng1 Longitude of first point
     * @param lat2 Latitude of second point
     * @param lng2 Longitude of second point
     * @returns Distance in kilometers
     */
    private static calculateDistance(
        lat1: number,
        lng1: number,
        lat2: number,
        lng2: number,
    ): number {
        const R = 6371; // Earth's radius in kilometers
        const dLat = AiRouteClusteringService.toRadians(lat2 - lat1);
        const dLng = AiRouteClusteringService.toRadians(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(AiRouteClusteringService.toRadians(lat1)) *
                Math.cos(AiRouteClusteringService.toRadians(lat2)) *
                Math.sin(dLng / 2) *
                Math.sin(dLng / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Converts degrees to radians
     */
    private static toRadians(degrees: number): number {
        return degrees * (Math.PI / 180);
    }

    /**
     * Validates clustering options
     */
    public static validateOptions(options: Partial<ClusteringOptions>): ClusteringOptions {
        const validated = { ...AiRouteClusteringService.DEFAULT_OPTIONS, ...options };

        if (validated.proximityRadiusKm <= 0) {
            throw new Error('Proximity radius must be greater than 0');
        }

        if (validated.minSpotsPerCluster < 1) {
            throw new Error('Minimum spots per cluster must be at least 1');
        }

        if (validated.maxSpotsPerCluster < validated.minSpotsPerCluster) {
            throw new Error('Maximum spots per cluster must be greater than or equal to minimum');
        }

        return validated;
    }
}
