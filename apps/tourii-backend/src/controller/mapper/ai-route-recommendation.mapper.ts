import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import type {
    GeneratedRoute,
    RouteRecommendationResult,
} from '@app/core/infrastructure/ai-route/ai-route-recommendation.service';
import { Logger } from '@nestjs/common';
import {
    AiGeneratedRouteResponseDto,
    AiRouteRecommendationResponseDto,
    ExistingRouteResponseDto,
} from '../model/tourii-response/ai-route-recommendation-response.model';

export class AiRouteRecommendationMapper {
    private static readonly logger = new Logger(AiRouteRecommendationMapper.name);

    static toResponseDto(
        result: RouteRecommendationResult,
        searchKeywords: string[],
        aiAvailable: boolean,
    ): AiRouteRecommendationResponseDto {
        try {
            return {
                generatedRoutes: result.generatedRoutes.map((route) =>
                    AiRouteRecommendationMapper.mapGeneratedRoute(route, searchKeywords),
                ),
                summary: AiRouteRecommendationMapper.mapSummary(result.summary, aiAvailable),
                message: AiRouteRecommendationMapper.generateSuccessMessage(
                    result.generatedRoutes.length,
                ),
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            AiRouteRecommendationMapper.logger.error(
                'Failed to map route recommendation result to response DTO',
                {
                    error: errorMessage,
                    routesCount: result.generatedRoutes.length,
                },
            );
            throw error;
        }
    }

    private static mapGeneratedRoute(
        route: GeneratedRoute,
        searchKeywords: string[],
    ): AiGeneratedRouteResponseDto {
        return {
            modelRouteId: AiRouteRecommendationMapper.safeString(route.modelRoute.modelRouteId),
            routeName: AiRouteRecommendationMapper.safeString(route.modelRoute.routeName),
            regionDesc: AiRouteRecommendationMapper.safeString(route.modelRoute.regionDesc),
            recommendations: route.modelRoute.recommendation || [],
            region: AiRouteRecommendationMapper.safeString(route.modelRoute.region),
            regionLatitude: route.modelRoute.regionLatitude || 0,
            regionLongitude: route.modelRoute.regionLongitude || 0,
            estimatedDuration: route.aiContent.estimatedDuration,
            confidenceScore: route.aiContent.confidenceScore,
            spotCount: route.metadata.spotCount,
            averageDistance: route.cluster.averageDistance,
            touristSpots: route.cluster.spots.map((spot) => ({
                touristSpotId: AiRouteRecommendationMapper.safeString(spot.touristSpotId),
                touristSpotName: AiRouteRecommendationMapper.safeString(spot.touristSpotName),
                touristSpotDesc: spot.touristSpotDesc,
                latitude: spot.latitude || 0,
                longitude: spot.longitude || 0,
                touristSpotHashtag: spot.touristSpotHashtag || [],
                matchedKeywords: AiRouteRecommendationMapper.findMatchedKeywords(
                    spot.touristSpotHashtag || [],
                    searchKeywords,
                ),
            })),
            metadata: {
                sourceKeywords: route.metadata.sourceKeywords,
                generatedAt: route.metadata.generatedAt.toISOString(),
                algorithm: route.metadata.algorithm,
                aiGenerated: true,
            },
        };
    }

    private static mapSummary(summary: RouteRecommendationResult['summary'], aiAvailable: boolean) {
        return {
            ...summary,
            aiAvailable,
        };
    }

    private static generateSuccessMessage(routesGenerated: number): string {
        if (routesGenerated === 0) {
            return 'No matching tourist spots found for the given keywords';
        }
        return `Successfully generated ${routesGenerated} AI route recommendation${
            routesGenerated === 1 ? '' : 's'
        }`;
    }

    private static findMatchedKeywords(hashtags: string[], searchKeywords: string[]): string[] {
        const normalizedHashtags = hashtags.map((h) => h.toLowerCase());
        return searchKeywords.filter((keyword) =>
            normalizedHashtags.some((tag) => tag.includes(keyword.toLowerCase())),
        );
    }

    private static safeString(value: string | undefined | null): string {
        return value ?? '';
    }
}
