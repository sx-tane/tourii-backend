import { ContextStorage, TouriiBackendAppErrorType, TouriiBackendAppException } from '@app/core';
import { AiRouteClusteringRepositoryImpl } from '@app/core/infrastructure/ai-route/ai-route-clustering.repository-impl';
import { AiRouteGeneratorRepositoryImpl } from '@app/core/infrastructure/ai-route/ai-route-generator.repository-impl';
import { ModelRouteCreateRequestBuilder } from '@app/tourii-backend/service/builder/model-route-create-request-builder';
import { Logger } from '@nestjs/common';
import { ModelRouteEntity } from '../game/model-route/model-route.entity';
import { ModelRouteRepository } from '../game/model-route/model-route.repository';
import { TouristSpot } from '../game/model-route/tourist-spot';
import { LocationInfoRepository } from '../geo/location-info.repository';
import { WeatherInfo } from '../geo/weather-info';
import { ALGORITHM_VERSIONS } from './ai-route-constants';
import { RouteRecommendationRequest } from './route-recommendation';

export interface CenterCoordinates {
    lat: number;
    lng: number;
}

export interface TouristSpotCluster {
    id: string;
    spots: TouristSpot[];
    centerCoordinates: CenterCoordinates;
    region: string;
    averageDistance: number;
}

export interface AiGeneratedRouteContent {
    routeName: string;
    regionDesc: string;
    recommendations: string[];
    estimatedDuration: string;
    confidenceScore: number;
}

export interface ClusteringOptions {
    proximityRadiusKm: number;
    minSpotsPerCluster: number;
    maxSpotsPerCluster: number;
}

export interface GeneratedRouteSummary {
    totalSpotsFound: number;
    clustersFormed: number;
    routesGenerated: number;
    processingTimeMs: number;
}

export interface GeneratedRouteMetadata {
    sourceKeywords: string[];
    spotCount: number;
    generatedAt: Date;
    algorithm: string;
}

export interface GeneratedRoute {
    modelRoute: ModelRouteEntity;
    cluster: TouristSpotCluster;
    aiContent: AiGeneratedRouteContent;
    metadata: GeneratedRouteMetadata;
}

export interface AiRouteAdditionalContext {
    season?: string;
    travelStyle?: string;
    groupSize?: number;
}

export interface ContentGenerationRequest {
    cluster: TouristSpotCluster;
    userKeywords: string[];
    additionalContext?: AiRouteAdditionalContext;
}

export interface AiRouteGenerationResultDto {
    generatedRoutes: GeneratedRoute[];
    summary: GeneratedRouteSummary;
}

export interface AiRouteUnificationOptions {
    keywords: string[];
    region?: string;
    existingRoutes: ModelRouteEntity[];
    aiResult: AiRouteGenerationResultDto;
    userId: string;
    aiAvailable: boolean;
    // Weather data for proper DTO building
    existingRoutesWeatherData?: Map<
        string,
        { spotWeather: WeatherInfo[]; regionWeather: WeatherInfo }
    >;
    generatedRoutesWeatherData?: Map<
        string,
        { spotWeather: WeatherInfo[]; regionWeather: WeatherInfo }
    >;
}

export class AiRoute {
    /**
     * Generates route recommendations
     * @param request - The request parameters
     * @param modelRouteRepository - The repository for accessing model routes
     * @returns The generated route recommendations
     */
    static async generateAiRoutes(
        request: RouteRecommendationRequest,
        modelRouteRepository: ModelRouteRepository,
        aiRouteGeneratorRepository: AiRouteGeneratorRepositoryImpl,
        locationInfoRepository: LocationInfoRepository,
    ): Promise<AiRouteGenerationResultDto> {
        const startTime = Date.now();

        Logger.debug('Starting AI route recommendation generation', {
            keywords: request.keywords,
            mode: request.mode,
            region: request.region,
        });

        // Step 1: Find tourist spots matching keywords
        const matchingSpots = await AiRoute.findMatchingTouristSpots(request, modelRouteRepository);

        if (matchingSpots.length === 0) {
            Logger.log('No tourist spots found matching criteria', {
                keywords: request.keywords,
                mode: request.mode,
                region: request.region,
            });

            return {
                generatedRoutes: [],
                summary: {
                    totalSpotsFound: 0,
                    clustersFormed: 0,
                    routesGenerated: 0,
                    processingTimeMs: Date.now() - startTime,
                },
            };
        }

        Logger.debug(`Found ${matchingSpots.length} matching tourist spots`);

        // Step 2: Cluster spots by geographic proximity
        const clusters = AiRoute.clusterTouristSpots(matchingSpots, request.clusteringOptions);

        Logger.debug(`Formed ${clusters.length} geographic clusters`);

        // Step 3: Generate AI content and create routes for each cluster
        const generatedRoutes = await AiRoute.generateAiRoutesFromClusters(
            clusters,
            aiRouteGeneratorRepository,
            locationInfoRepository,
            modelRouteRepository,
            request.keywords,
            request.maxRoutes || 5,
            request.userId,
        );

        // Calculate processing time
        const processingTime = Date.now() - startTime;

        Logger.log('AI route recommendation generation completed', {
            totalSpotsFound: matchingSpots.length,
            clustersFormed: clusters.length,
            routesGenerated: generatedRoutes.length,
            processingTimeMs: processingTime,
        });

        // Return the generated routes and summary
        return {
            generatedRoutes,
            summary: {
                totalSpotsFound: matchingSpots.length,
                clustersFormed: clusters.length,
                routesGenerated: generatedRoutes.length,
                processingTimeMs: processingTime,
            },
        };
    }

    /**
     * Finds tourist spots matching the search criteria
     * @param request - The request parameters
     * @param modelRouteRepository - The repository for accessing model routes
     * @returns The matching tourist spots
     */
    private static async findMatchingTouristSpots(
        request: RouteRecommendationRequest,
        modelRouteRepository: ModelRouteRepository,
    ): Promise<TouristSpot[]> {
        const normalizedKeywords = request.keywords.map((k) => k.toLowerCase().trim());
        return modelRouteRepository.findTouristSpotsByHashtags(
            normalizedKeywords,
            request.mode,
            request.region,
        );
    }

    /**
     * Clusters tourist spots by geographic proximity
     * @param spots - The tourist spots to cluster
     * @param clusteringOptions - The clustering options
     * @returns The clustered tourist spots
     */
    private static clusterTouristSpots(
        spots: TouristSpot[],
        clusteringOptions?: Partial<ClusteringOptions>,
    ): TouristSpotCluster[] {
        return AiRouteClusteringRepositoryImpl.clusterTouristSpots(spots, clusteringOptions);
    }

    /**
     * Generates routes from clusters using AI content generation
     * @param clusters - The clusters to generate routes from
     * @param userKeywords - The user keywords
     * @param maxRoutes - The maximum number of routes to generate
     * @param userId - The user ID
     * @returns The generated routes
     */
    private static async generateAiRoutesFromClusters(
        clusters: TouristSpotCluster[],
        aiRouteGeneratorRepositoryImpl: AiRouteGeneratorRepositoryImpl,
        locationInfoRepository: LocationInfoRepository,
        modelRouteRepository: ModelRouteRepository,
        userKeywords: string[],
        maxRoutes: number,
        userId?: string,
    ): Promise<GeneratedRoute[]> {
        const generatedRoutes: GeneratedRoute[] = [];

        // Sort clusters by quality (more spots and lower average distance = better)
        const sortedClusters = clusters
            .sort((a, b) => {
                const scoreA = a.spots.length / (a.averageDistance + 1);
                const scoreB = b.spots.length / (b.averageDistance + 1);
                return scoreB - scoreA;
            })
            .slice(0, maxRoutes);

        // Generate routes for each cluster
        for (const cluster of sortedClusters) {
            try {
                Logger.debug(`Generating content for cluster ${cluster.id}`, {
                    spotCount: cluster.spots.length,
                    region: cluster.region,
                });

                // Generate AI content for the cluster
                const aiRoute = await aiRouteGeneratorRepositoryImpl.generateRouteContent({
                    cluster,
                    userKeywords,
                });

                // Create model route entity with AI-generated content
                const modelRoute = await AiRoute.createModelRouteFromCluster(
                    cluster,
                    aiRoute,
                    locationInfoRepository,
                    modelRouteRepository,
                    userId,
                );

                generatedRoutes.push({
                    modelRoute,
                    cluster,
                    aiContent: aiRoute,
                    metadata: {
                        sourceKeywords: userKeywords,
                        spotCount: cluster.spots.length,
                        generatedAt:
                            ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                        algorithm: ALGORITHM_VERSIONS.AI_CLUSTERING_V1,
                    },
                });

                Logger.debug(`Successfully generated route: ${aiRoute.routeName}`, {
                    clusterId: cluster.id,
                    routeId: modelRoute.modelRouteId,
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                Logger.error(`Failed to generate route for cluster ${cluster.id}`, {
                    error: errorMessage,
                    clusterId: cluster.id,
                    spotCount: cluster.spots.length,
                });
                // Continue with other clusters even if one fails
            }
        }

        return generatedRoutes;
    }

    /**
     * Creates a model route from a cluster
     * @param cluster - The cluster to create a model route from
     * @param aiContent - The AI content to create a model route from
     * @param locationInfoRepository - The location info repository
     * @param modelRouteRepository - The model route repository
     * @param userId - The user ID
     * @returns The created model route
     */
    private static async createModelRouteFromCluster(
        cluster: TouristSpotCluster,
        aiContent: AiGeneratedRouteContent,
        locationInfoRepository: LocationInfoRepository,
        modelRouteRepository: ModelRouteRepository,
        userId?: string,
    ): Promise<ModelRouteEntity> {
        const systemUserId = userId || 'anonymous';

        // Select representative background media from cluster spots
        const backgroundMedia = await TouristSpot.selectRepresentativeImage(
            cluster.spots,
            locationInfoRepository,
            modelRouteRepository,
        );

        const savedRoute = await modelRouteRepository.createModelRoute(
            ModelRouteCreateRequestBuilder.dtoToGeneratedAiRoute(
                aiContent,
                backgroundMedia,
                systemUserId,
                cluster.region,
                cluster.centerCoordinates.lat,
                cluster.centerCoordinates.lng,
            ),
        );

        if (!savedRoute.modelRouteId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_MR_001);
        }

        // Create junction table entries to link existing spots to the new route
        await AiRoute.linkExistingSpotsToRoute(
            savedRoute.modelRouteId,
            cluster.spots,
            systemUserId,
            modelRouteRepository,
        );

        Logger.debug('Created new AI-generated model route', {
            routeId: savedRoute.modelRouteId,
            routeName: aiContent.routeName,
            region: cluster.region,
            spotCount: cluster.spots.length,
        });

        return savedRoute;
    }

    /**
     * Links existing tourist spots to a route via the junction table
     * @param modelRouteId - The ID of the model route to link the spots to
     * @param spots - The tourist spots to link to the route
     * @param systemUserId - The ID of the system user
     * @param modelRouteRepository - The model route repository
     */
    private static async linkExistingSpotsToRoute(
        modelRouteId: string,
        spots: TouristSpot[],
        systemUserId: string,
        modelRouteRepository: ModelRouteRepository,
    ): Promise<void> {
        const junctionRecords = spots
            .map((spot, index) => ({
                modelRouteId,
                touristSpotId: spot.touristSpotId || '',
                displayOrder: index + 1,
                isPrimary: false,
                createdBy: systemUserId,
            }))
            .filter((record) => record.touristSpotId !== '');

        // Create junction table entries to link existing spots to the new route
        await modelRouteRepository.createRouteTouristSpotJunctions(junctionRecords);

        Logger.debug('Linked existing tourist spots to AI route', {
            routeId: modelRouteId,
            spotCount: spots.length,
            spotIds: spots.map((s) => s.touristSpotId),
        });
    }

    /**
     * Generates a success message for the route recommendation
     * @param routesGenerated - The number of routes generated
     * @returns A success message
     */
    static generateSuccessMessage(routesGenerated: number): string {
        if (routesGenerated === 0) {
            return 'No matching tourist spots found for the given keywords';
        }
        return `Successfully generated ${routesGenerated} AI route recommendation${
            routesGenerated === 1 ? '' : 's'
        }`;
    }

    /**
     *  Finds the matched keywords in the hashtags
     * @param hashtags - The hashtags to search in
     * @param searchKeywords - The search keywords
     * @returns The matched keywords
     */
    static findMatchedKeywords(hashtags: string[], searchKeywords: string[]): string[] {
        const normalizedHashtags = hashtags.map((h) => h.toLowerCase());
        return searchKeywords.filter((keyword) =>
            normalizedHashtags.some((tag) => tag.includes(keyword.toLowerCase())),
        );
    }
}
