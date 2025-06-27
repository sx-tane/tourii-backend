import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Body, Controller, Headers, HttpStatus, Logger, Post } from '@nestjs/common';
import {
    ApiBody,
    ApiExtraModels,
    ApiHeader,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { AiRouteRecommendationService } from '../service/ai-route-recommendation.service';
import {
    ApiDefaultBadRequestResponse,
    ApiInvalidVersionResponse,
} from '../support/decorators/api-error-responses.decorator';
import { AiRouteRecommendationMapper } from './mapper/ai-route-recommendation.mapper';
import {
    AiRouteRecommendationRequestDto,
    AiRouteRecommendationRequestSchema,
} from './model/tourii-request/ai-route-recommendation-request.model';
import {
    AiRouteRecommendationResponseDto,
    AiRouteRecommendationResponseSchema,
} from './model/tourii-response/ai-route-recommendation-response.model';

@ApiTags('AI Route Recommendations')
@ApiHeader({
    name: 'accept-version',
    description: 'API version',
    required: true,
    example: '1.0.0',
})
@ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
})
@ApiExtraModels(AiRouteRecommendationRequestDto, AiRouteRecommendationResponseDto)
@Controller('ai/routes')
export class AiRouteRecommendationController {
    private readonly logger = new Logger(AiRouteRecommendationController.name);

    constructor(private readonly aiRouteRecommendationService: AiRouteRecommendationService) {}

    @Post('recommendations')
    @ApiOperation({
        summary: 'Generate AI-powered route recommendations',
        description: `
            Generates intelligent travel route recommendations using AI by:
            1. Finding tourist spots matching your keywords/hashtags
            2. Clustering nearby spots geographically 
            3. Using AI (GPT) to generate route names, descriptions, and themes
            4. Creating new model routes with AI-generated content
            
            Perfect for discovering themed travel experiences like "animation & scenery" routes.
        `,
    })
    @ApiBody({
        type: AiRouteRecommendationRequestDto,
        description: 'Route recommendation request with keywords and preferences',
        schema: zodToOpenAPI(AiRouteRecommendationRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'AI route recommendations generated successfully',
        type: AiRouteRecommendationResponseDto,
        schema: zodToOpenAPI(AiRouteRecommendationResponseSchema),
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid request parameters',
    })
    @ApiResponse({
        status: HttpStatus.TOO_MANY_REQUESTS,
        description: 'Rate limit exceeded for AI route generation',
    })
    @ApiResponse({
        status: HttpStatus.SERVICE_UNAVAILABLE,
        description: 'AI service temporarily unavailable',
    })
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async generateRouteRecommendations(
        @Body() request: AiRouteRecommendationRequestDto,
        @Headers('x-user-id') userId?: string,
    ): Promise<AiRouteRecommendationResponseDto> {
        try {
            this.logger.log('AI route recommendation request received', {
                keywords: request.keywords,
                mode: request.mode,
                region: request.region,
                userId: userId || 'anonymous',
            });

            // Rate limiting check (simple implementation)
            if (userId) {
                await this.checkRateLimit(userId);
            }

            // Validate request
            this.aiRouteRecommendationService.validateRequest({
                keywords: request.keywords,
                mode: request.mode,
                region: request.region,
                clusteringOptions: {
                    proximityRadiusKm: request.proximityRadiusKm,
                    minSpotsPerCluster: request.minSpotsPerCluster,
                    maxSpotsPerCluster: request.maxSpotsPerCluster,
                },
                maxRoutes: request.maxRoutes,
                userId,
            });

            // Generate recommendations
            const result = await this.aiRouteRecommendationService.generateRouteRecommendations({
                keywords: request.keywords,
                mode: request.mode,
                region: request.region,
                clusteringOptions: {
                    proximityRadiusKm: request.proximityRadiusKm,
                    minSpotsPerCluster: request.minSpotsPerCluster,
                    maxSpotsPerCluster: request.maxSpotsPerCluster,
                },
                maxRoutes: request.maxRoutes,
                userId,
            });

            // Transform to response DTO using dedicated mapper
            const response = AiRouteRecommendationMapper.toResponseDto(
                result,
                request.keywords,
                this.aiRouteRecommendationService.getServiceStatus().aiAvailable,
            );

            this.logger.log('AI route recommendation completed', {
                routesGenerated: result.generatedRoutes.length,
                processingTime: result.summary.processingTimeMs,
                userId: userId || 'anonymous',
            });

            return response;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error('AI route recommendation failed', {
                error: errorMessage,
                keywords: request.keywords,
                userId: userId || 'anonymous',
            });

            if (error instanceof TouriiBackendAppException) {
                throw error;
            }

            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_049, {
                originalError: errorMessage,
            });
        }
    }

    /**
     * Simple rate limiting check
     */
    private async checkRateLimit(userId: string): Promise<void> {
        // TODO: Implement proper rate limiting with Redis
        // For now, this is a placeholder
        this.logger.debug(`Rate limit check for user: ${userId}`);
    }
}
