import { PREFECTURE_BOUNDARIES } from '../domain/ai-route/ai-route-constants';
import { TouristSpot } from '../domain/game/model-route/tourist-spot';
import { JapaneseAddressParserService } from '../infrastructure/geo/japanese-address-parser.service';

/**
 * Utility class for detecting regions from coordinates and addresses
 * Eliminates code duplication across clustering and route services
 */
export class RegionDetectionUtil {
    private static readonly addressParser = new JapaneseAddressParserService();

    /**
     * Determines region from tourist spot using multiple methods
     */
    static determineRegionFromSpot(spot: TouristSpot): string {
        // Try to extract prefecture from address first
        if (spot.address) {
            const parsed = RegionDetectionUtil.addressParser.parseAddress(spot.address);
            if (parsed.confidence > 0.5) {
                return parsed.prefecture;
            }
        }

        // Fallback to coordinate-based prefecture detection
        if (spot.latitude && spot.longitude) {
            return RegionDetectionUtil.getRegionFromCoordinates(spot.latitude, spot.longitude);
        }

        return 'Tokyo'; // Default fallback
    }

    /**
     * Gets region/prefecture from GPS coordinates
     */
    static getRegionFromCoordinates(latitude: number, longitude: number): string {
        // Check each prefecture boundary
        for (const [prefecture, bounds] of Object.entries(PREFECTURE_BOUNDARIES)) {
            if (
                latitude >= bounds.latMin &&
                latitude <= bounds.latMax &&
                longitude >= bounds.lngMin &&
                longitude <= bounds.lngMax
            ) {
                return prefecture;
            }
        }

        return 'Tokyo'; // Default fallback
    }

    /**
     * Determines the most common region from a collection of spots
     * Used for cluster region determination
     */
    static determineMostCommonRegion(spots: TouristSpot[]): string {
        // Extract regions from first hashtag of each tourist spot
        const regions = spots
            .map((spot) => {
                // Use first hashtag as region
                if (spot.touristSpotHashtag?.length && spot.touristSpotHashtag[0]?.trim()) {
                    return spot.touristSpotHashtag[0].trim();
                }

                // Fallback to coordinate-based detection
                return RegionDetectionUtil.determineRegionFromSpot(spot);
            })
            .filter((region) => region !== 'Unknown');

        if (regions.length === 0) {
            return 'Unknown';
        }

        // Find most common region
        const regionCounts = regions.reduce(
            (counts, region) => {
                counts[region] = (counts[region] || 0) + 1;
                return counts;
            },
            {} as Record<string, number>,
        );

        return (
            Object.keys(regionCounts).reduce((a, b) =>
                regionCounts[a] > regionCounts[b] ? a : b,
            ) || 'Unknown'
        );
    }

    /**
     * Validates if coordinates are within valid Japanese boundaries
     */
    static isValidJapaneseCoordinates(latitude: number, longitude: number): boolean {
        // Rough boundaries for Japan
        return latitude >= 24.0 && latitude <= 46.0 && longitude >= 123.0 && longitude <= 146.0;
    }
}
