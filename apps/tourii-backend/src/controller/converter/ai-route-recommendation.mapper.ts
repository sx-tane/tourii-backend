import { TouristSpot } from '@app/core';
import {
    AiRoute,
    AiRouteGenerationResultDto,
    GeneratedRoute,
    GeneratedRouteSummary,
} from '@app/core/domain/ai-route/ai-route';
import { ValidateUtil } from '@app/core/utils/validate.util';
import { Logger } from '@nestjs/common';
import {
    AiGeneratedRouteResponseDto,
    AiRouteRecommendationResponseDto,
} from '../model/tourii-response/ai-route-recommendation-response.model';

export class AiRouteRecommendationBuilder {
    static toResponseDto(
        result: AiRouteGenerationResultDto,
        searchKeywords: string[],
        aiAvailable: boolean,
    ): AiRouteRecommendationResponseDto {
        try {
            return {
                generatedRoutes: result.generatedRoutes.map((route: GeneratedRoute) =>
                    AiRouteRecommendationBuilder.mapGeneratedRoute(route, searchKeywords),
                ),
                summary: AiRouteRecommendationBuilder.mapSummary(result.summary, aiAvailable),
                message: AiRoute.generateSuccessMessage(result.generatedRoutes.length),
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            Logger.error('Failed to map route recommendation result to response DTO', {
                error: errorMessage,
                routesCount: result.generatedRoutes.length,
            });
            throw error;
        }
    }

    private static mapGeneratedRoute(
        route: GeneratedRoute,
        searchKeywords: string[],
    ): AiGeneratedRouteResponseDto {
        return {
            modelRouteId: ValidateUtil.safeString(route.modelRoute.modelRouteId),
            routeName: ValidateUtil.safeString(route.modelRoute.routeName),
            regionDesc: ValidateUtil.safeString(route.modelRoute.regionDesc),
            recommendations: route.modelRoute.recommendation || [],
            region: ValidateUtil.safeString(route.modelRoute.region),
            regionLatitude: route.modelRoute.regionLatitude || 0,
            regionLongitude: route.modelRoute.regionLongitude || 0,
            estimatedDuration: route.aiContent.estimatedDuration,
            confidenceScore: route.aiContent.confidenceScore,
            spotCount: route.metadata.spotCount,
            averageDistance: route.cluster.averageDistance,
            touristSpots: route.cluster.spots.map((spot: TouristSpot) =>
                AiRouteRecommendationBuilder.touristSpot(spot, searchKeywords),
            ),
            metadata: AiRouteRecommendationBuilder.metadata(route),
        };
    }

    /**
     * Maps the summary of the route recommendation
     * @param summary - The summary of the route recommendation
     * @param aiAvailable - Whether AI is available
     * @returns The mapped summary
     */
    private static mapSummary(summary: GeneratedRouteSummary, aiAvailable: boolean) {
        return {
            ...summary,
            aiAvailable,
        };
    }

    /**
     * Maps the tourist spot of the route recommendation
     * @param spot - The tourist spot
     * @returns The mapped tourist spot
     */
    private static touristSpot(spot: TouristSpot, searchKeywords: string[]) {
        return {
            touristSpotId: ValidateUtil.safeString(spot.touristSpotId),
            touristSpotName: ValidateUtil.safeString(spot.touristSpotName),
            touristSpotDesc: spot.touristSpotDesc,
            latitude: spot.latitude || 0,
            longitude: spot.longitude || 0,
            touristSpotHashtag: spot.touristSpotHashtag || [],
            matchedKeywords: AiRoute.findMatchedKeywords(
                spot.touristSpotHashtag || [],
                searchKeywords,
            ),
        };
    }

    /**
     * Maps the metadata of the route recommendation
     * @param route - The route recommendation
     * @returns The mapped metadata
     */
    private static metadata(route: GeneratedRoute) {
        return {
            sourceKeywords: route.metadata.sourceKeywords,
            generatedAt: route.metadata.generatedAt.toISOString(),
            algorithm: route.metadata.algorithm,
            aiGenerated: true,
        };
    }
}
