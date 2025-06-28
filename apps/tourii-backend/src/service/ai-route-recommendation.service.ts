import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
import { LocationInfoRepository } from '@app/core/domain/geo/location-info.repository';
import { AiContentGeneratorService } from '@app/core/infrastructure/ai-route/ai-content-generator.service';
import {
    AiRouteRecommendationService as DomainAiRouteRecommendationService,
    RouteRecommendationRequest,
    RouteRecommendationResult,
} from '@app/core/infrastructure/ai-route/ai-route-recommendation.service';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TouriiBackendConstants } from '../tourii-backend.constant';

@Injectable()
export class AiRouteRecommendationService {
    private readonly logger = new Logger(AiRouteRecommendationService.name);
    private readonly domainService: DomainAiRouteRecommendationService;

    constructor(
        @Inject(TouriiBackendConstants.MODEL_ROUTE_REPOSITORY_TOKEN)
        private readonly modelRouteRepository: ModelRouteRepository,
        @Inject(TouriiBackendConstants.LOCATION_INFO_REPOSITORY_TOKEN)
        private readonly locationInfoRepository: LocationInfoRepository,
        private readonly configService: ConfigService,
    ) {
        // Create the AI content generator service with proper dependencies
        const aiContentGenerator = new AiContentGeneratorService(
            this.configService,
            this.locationInfoRepository,
        );

        // Create the domain service with dependencies
        this.domainService = new DomainAiRouteRecommendationService(
            this.modelRouteRepository,
            aiContentGenerator,
        );
    }

    /**
     * Generates AI-powered route recommendations based on user keywords
     */
    async generateRouteRecommendations(
        request: RouteRecommendationRequest,
    ): Promise<RouteRecommendationResult> {
        this.logger.debug('Delegating to domain service for route recommendations', {
            keywords: request.keywords,
            mode: request.mode,
        });

        return await this.domainService.generateRouteRecommendations(request);
    }

    /**
     * Validates request parameters
     */
    public validateRequest(request: RouteRecommendationRequest): void {
        this.domainService.validateRequest(request);
    }

    /**
     * Gets available hashtags in the database
     */
    async getAvailableHashtags(region?: string): Promise<{
        hashtags: string[];
        totalCount: number;
        topHashtags: Array<{ hashtag: string; count: number }>;
    }> {
        return await this.domainService.getAvailableHashtags(region);
    }

    /**
     * Gets service status and configuration
     */
    public getServiceStatus(): {
        aiAvailable: boolean;
        defaultClusteringOptions: any;
    } {
        return this.domainService.getServiceStatus();
    }
}
