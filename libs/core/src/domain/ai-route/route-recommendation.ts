import { AiRouteClusteringRepositoryImpl } from '@app/core/infrastructure/ai-route/ai-route-clustering.repository-impl';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { ClusteringOptions } from './ai-route';

export enum RouteRecommendationMode {
    ALL = 'all',
    ANY = 'any',
}

export interface RouteRecommendationRequest {
    keywords: string[];
    mode: RouteRecommendationMode;
    region?: string;
    clusteringOptions?: Partial<ClusteringOptions>;
    maxRoutes?: number;
    userId?: string;
} // Standard interface for route recommendations

export class RouteRecommendation {
    /**
     * Validates the request parameters for route recommendation
     * @param request - The request parameters
     * @throws TouriiBackendAppException if the request is invalid
     */
    static validateRequest(request: RouteRecommendationRequest): void {
        if (!request.keywords || request.keywords.length === 0) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_MR_005);
        }

        if (request.keywords.length > 10) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_MR_012);
        }

        if (request.keywords.some((keyword) => keyword.length > 50)) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_MR_013);
        }

        if (request.maxRoutes && (request.maxRoutes < 1 || request.maxRoutes > 20)) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_MR_014);
        }

        if (request.clusteringOptions) {
            AiRouteClusteringRepositoryImpl.validateOptions(request.clusteringOptions);
        }
    }

    /**
     * Generates fallback recommendations based on keywords and tourist spot hashtags
     * @param keywords - User search keywords
     * @param spots - Tourist spots with hashtags
     * @returns Array of recommendation strings
     */
    static generateFallbackRecommendations(
        keywords: string[] = [], 
        spots: { touristSpotHashtag?: string[] }[] = []
    ): string[] {
        const recommendations = new Set<string>();
        
        // Map keywords to recommendations
        keywords.forEach(keyword => {
            const lowerKeyword = keyword.toLowerCase();
            if (lowerKeyword.includes('waterfall') || lowerKeyword.includes('nature')) {
                recommendations.add('Nature');
                recommendations.add('Photography');
            }
            if (lowerKeyword.includes('food') || lowerKeyword.includes('restaurant') || lowerKeyword.includes('cuisine')) {
                recommendations.add('Local Food');
            }
            if (lowerKeyword.includes('temple') || lowerKeyword.includes('shrine') || lowerKeyword.includes('buddhism')) {
                recommendations.add('Historical Sites');
            }
            if (lowerKeyword.includes('culture') || lowerKeyword.includes('traditional')) {
                recommendations.add('Cultural Experience');
            }
            if (lowerKeyword.includes('mountain') || lowerKeyword.includes('hiking')) {
                recommendations.add('Adventure');
                recommendations.add('Nature');
            }
            if (lowerKeyword.includes('shopping') || lowerKeyword.includes('market')) {
                recommendations.add('Shopping');
            }
            if (lowerKeyword.includes('hot spring') || lowerKeyword.includes('onsen')) {
                recommendations.add('Relaxation');
            }
        });

        // Map spot hashtags to recommendations
        spots.forEach(spot => {
            const hashtags = spot.touristSpotHashtag || [];
            hashtags.forEach((tag: string) => {
                const lowerTag = tag.toLowerCase();
                if (lowerTag.includes('nature') || lowerTag.includes('waterfall') || lowerTag.includes('park')) {
                    recommendations.add('Nature');
                    recommendations.add('Photography');
                }
                if (lowerTag.includes('food') || lowerTag.includes('restaurant')) {
                    recommendations.add('Local Food');
                }
                if (lowerTag.includes('buddhism') || lowerTag.includes('temple') || lowerTag.includes('shrine')) {
                    recommendations.add('Historical Sites');
                }
                if (lowerTag.includes('culture') || lowerTag.includes('traditional')) {
                    recommendations.add('Cultural Experience');
                }
                if (lowerTag.includes('mountain') || lowerTag.includes('hiking')) {
                    recommendations.add('Adventure');
                }
                if (lowerTag.includes('shopping')) {
                    recommendations.add('Shopping');
                }
                if (lowerTag.includes('hot spring') || lowerTag.includes('onsen')) {
                    recommendations.add('Relaxation');
                }
            });
        });

        // Always ensure we have default recommendations
        if (recommendations.size === 0) {
            recommendations.add('Ideal for First Time Visitors');
            recommendations.add('Photography');
            recommendations.add('Local Food');
        } else {
            // Ensure we have at least 2-3 recommendations
            if (recommendations.size < 2) {
                recommendations.add('Photography');
            }
            if (recommendations.size < 3) {
                recommendations.add('Local Food');
            }
        }

        return Array.from(recommendations).slice(0, 5);
    }
}
