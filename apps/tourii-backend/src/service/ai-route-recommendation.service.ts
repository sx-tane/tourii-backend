import { AiContentGeneratorService } from '@app/core/domain/ai-route/ai-content-generator.service';
import {
    AiRouteRecommendationService as DomainAiRouteRecommendationService,
    RouteRecommendationRequest,
    RouteRecommendationResult,
} from '@app/core/domain/ai-route/ai-route-recommendation.service';
import { ModelRouteRepository } from '@app/core/domain/game/model-route/model-route.repository';
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
        private readonly configService: ConfigService,
    ) {
        // Create the AI content generator service
        const aiContentGenerator = new AiContentGeneratorService(this.configService);

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
     * Gets service status and configuration
     */
    public getServiceStatus(): {
        aiAvailable: boolean;
        defaultClusteringOptions: any;
    } {
        return this.domainService.getServiceStatus();
    }
}
