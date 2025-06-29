import { AiRouteUnificationOptions } from '@app/core/domain/ai-route/ai-route';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { AiRouteRecommendationResponseDto } from '@app/tourii-backend/controller/model/tourii-response/ai-route-recommendation-response.model';

/**
 * Result builder for AI route recommendation responses
 * Transforms complex AI route generation results into unified response DTOs
 */
export class AiRouteRecommendationResultBuilder {
    /**
     * Build unified AI route recommendation response
     * Combines existing routes and AI-generated routes into a single response
     */
    static buildUnifiedResponse(
        options: AiRouteUnificationOptions,
    ): AiRouteRecommendationResponseDto {
        const { keywords, region, existingRoutes, aiResult, aiAvailable } = options;

        return {
            // Transform AI-generated routes
            generatedRoutes: aiResult.generatedRoutes.map((route) => ({
                modelRouteId: route.modelRoute.modelRouteId || '',
                routeName: route.modelRoute.routeName || '',
                regionDesc: route.modelRoute.regionDesc || '',
                regionBackgroundMedia: route.modelRoute.regionBackgroundMedia || '',
                recommendations: route.modelRoute.recommendation || [],
                region: route.modelRoute.region || '',
                regionLatitude: route.modelRoute.regionLatitude || 0,
                regionLongitude: route.modelRoute.regionLongitude || 0,
                estimatedDuration: route.aiContent.estimatedDuration,
                confidenceScore: route.aiContent.confidenceScore,
                spotCount: route.metadata.spotCount,
                averageDistance: route.cluster.averageDistance,
                touristSpots: AiRouteRecommendationResultBuilder.transformTouristSpots(
                    route.cluster.spots,
                    keywords,
                ),
                metadata: {
                    sourceKeywords: route.metadata.sourceKeywords,
                    generatedAt: route.metadata.generatedAt.toISOString(),
                    algorithm: route.metadata.algorithm,
                    aiGenerated: true,
                },
            })),

            // Transform existing routes
            existingRoutes: existingRoutes.map((route) => ({
                modelRouteId: route.modelRouteId || '',
                routeName: route.routeName || '',
                regionDesc: route.regionDesc || '',
                recommendations: route.recommendation || [],
                region: route.region || '',
                regionLatitude: route.regionLatitude || 0,
                regionLongitude: route.regionLongitude || 0,
                spotCount: route.touristSpotList?.length || 0,
                isAiGenerated: route.isAiGenerated || false,
                matchedKeywords: keywords,
                touristSpots: AiRouteRecommendationResultBuilder.transformTouristSpots(
                    route.touristSpotList || [],
                    keywords,
                ),
            })),

            // Build summary
            summary: {
                ...aiResult.summary,
                existingRoutesFound: existingRoutes.length,
                totalRoutesReturned: existingRoutes.length + aiResult.generatedRoutes.length,
                aiAvailable,
            },

            // Generate descriptive message
            message: AiRouteRecommendationResultBuilder.buildResponseMessage({
                existingCount: existingRoutes.length,
                aiCount: aiResult.generatedRoutes.length,
                keywords,
                region,
            }),
        };
    }

    /**
     * Transform tourist spots to response format with matched keywords
     */
    private static transformTouristSpots(
        spots: TouristSpot[],
        keywords: string[],
    ): Array<{
        touristSpotId: string;
        touristSpotName: string;
        touristSpotDesc: string | undefined;
        latitude: number;
        longitude: number;
        touristSpotHashtag: string[];
        matchedKeywords: string[];
    }> {
        return spots.map((spot) => ({
            touristSpotId: spot.touristSpotId || '',
            touristSpotName: spot.touristSpotName || '',
            touristSpotDesc: spot.touristSpotDesc,
            latitude: spot.latitude || 0,
            longitude: spot.longitude || 0,
            touristSpotHashtag: spot.touristSpotHashtag || [],
            matchedKeywords: keywords,
        }));
    }

    /**
     * Build descriptive response message
     */
    private static buildResponseMessage(options: {
        existingCount: number;
        aiCount: number;
        keywords: string[];
        region?: string;
    }): string {
        const { existingCount, aiCount, keywords, region } = options;
        const regionText = region ? ` in ${region}` : ' in all regions';
        const keywordText = keywords.join(', ');

        return `Found ${existingCount} existing routes and generated ${aiCount} AI routes based on your selected hashtags: ${keywordText}${regionText}`;
    }

    /**
     * Build error response for AI route recommendation failures
     */
    static buildErrorResponse(error: Error): AiRouteRecommendationResponseDto {
        return {
            generatedRoutes: [],
            existingRoutes: [],
            summary: {
                totalSpotsFound: 0,
                clustersFormed: 0,
                routesGenerated: 0,
                existingRoutesFound: 0,
                totalRoutesReturned: 0,
                processingTimeMs: 0,
                aiAvailable: false,
            },
            message: `Failed to generate route recommendations: ${error.message}`,
        };
    }
}
