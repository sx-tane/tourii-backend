import { TouriiBackendAppErrorType } from '@app/core';
import {
    AiGeneratedRouteContent,
    ClusteringOptions,
    ContentGenerationRequest,
} from '@app/core/domain/ai-route/ai-route';
import { RouteRecommendation } from '@app/core/domain/ai-route/route-recommendation';
import { OpenAiService } from '@app/core/provider/open-ai.service';
import { TouriiBackendConstants } from '@app/tourii-backend/tourii-backend.constant';
import { Inject, Logger } from '@nestjs/common';

export class AiRouteGeneratorRepositoryImpl {
    private readonly isOpenAiConfigured: boolean;

    constructor(
        @Inject(TouriiBackendConstants.OPENAI_SERVICE_TOKEN)
        private readonly openAiService: OpenAiService,
    ) {
        this.isOpenAiConfigured = this.openAiService?.isOpenAiConfigured() ?? false;
    }

    /**
     * Generates route content using OpenAI
     * @param request - The request object containing the content generation request
     * @returns The generated route content
     * @throws TouriiBackendAppException if the OpenAI API key is not configured
     * @throws TouriiBackendAppException if the AI content generation fails
     */
    async generateRouteContent(
        request: ContentGenerationRequest,
    ): Promise<AiGeneratedRouteContent> {
        try {
            if (this.isOpenAiConfigured && this.openAiService) {
                return await this.openAiService.generateAiRouteContentWithOpenAi(request);
            } else {
                return this.generateFallbackContent(request);
            }
        } catch (error) {
            Logger.error(TouriiBackendAppErrorType.E_OPENAI_002, {
                error: error instanceof Error ? error.message : String(error),
            });
            return this.generateFallbackContent(request);
        }
    }

    private generateFallbackContent(request: ContentGenerationRequest): AiGeneratedRouteContent {
        if (this.openAiService) {
            return this.openAiService.generateAiRouteFallbackContent(request);
        }

        // Ultimate fallback if openAiService is not available
        const fallbackRecommendations = RouteRecommendation.generateFallbackRecommendations(
            request.userKeywords,
            request.cluster.spots,
        );

        return {
            routeName: `Route for ${request.userKeywords.join(', ')}`,
            regionDesc: `A curated route featuring ${request.cluster.spots.length} locations related to ${request.userKeywords.join(', ')}.`,
            recommendations: fallbackRecommendations,
            estimatedDuration: '1-2 hours',
            confidenceScore: 0.5,
        };
    }

    /**
     * Gets the service status
     * @returns The service status
     */
    getServiceStatus(): {
        aiAvailable: boolean;
        defaultClusteringOptions: ClusteringOptions;
    } {
        return {
            aiAvailable: this.isOpenAiConfigured,
            defaultClusteringOptions: {
                proximityRadiusKm: 50,
                minSpotsPerCluster: 2,
                maxSpotsPerCluster: 8,
            },
        };
    }
}
