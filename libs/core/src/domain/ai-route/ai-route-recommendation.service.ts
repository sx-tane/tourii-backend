import { Injectable, Logger } from '@nestjs/common';
import { ModelRouteEntity } from '../game/model-route/model-route.entity';
import { ModelRouteRepository } from '../game/model-route/model-route.repository';
import { TouristSpot } from '../game/model-route/tourist-spot';
import { AiContentGeneratorService, AiGeneratedRouteContent } from './ai-content-generator.service';
import {
    AiRouteClusteringService,
    ClusteringOptions,
    TouristSpotCluster,
} from './ai-route-clustering.service';

export interface RouteRecommendationRequest {
    keywords: string[];
    mode: 'all' | 'any';
    region?: string;
    clusteringOptions?: Partial<ClusteringOptions>;
    maxRoutes?: number;
    userId?: string;
}

export interface GeneratedRoute {
    modelRoute: ModelRouteEntity;
    cluster: TouristSpotCluster;
    aiContent: AiGeneratedRouteContent;
    metadata: {
        sourceKeywords: string[];
        spotCount: number;
        generatedAt: Date;
        algorithm: string;
    };
}

export interface RouteRecommendationResult {
    generatedRoutes: GeneratedRoute[];
    summary: {
        totalSpotsFound: number;
        clustersFormed: number;
        routesGenerated: number;
        processingTimeMs: number;
    };
}

@Injectable()
export class AiRouteRecommendationService {
    private readonly logger = new Logger(AiRouteRecommendationService.name);

    constructor(
        private readonly modelRouteRepository: ModelRouteRepository,
        private readonly aiContentGenerator: AiContentGeneratorService,
    ) {}

    /**
     * Generates AI-powered route recommendations based on user keywords
     */
    async generateRouteRecommendations(
        request: RouteRecommendationRequest,
    ): Promise<RouteRecommendationResult> {
        const startTime = Date.now();

        this.logger.debug('Starting AI route recommendation generation', {
            keywords: request.keywords,
            mode: request.mode,
            region: request.region,
        });

        // Step 1: Find tourist spots matching keywords
        const matchingSpots = await this.findMatchingTouristSpots(request);

        if (matchingSpots.length === 0) {
            this.logger.info('No tourist spots found matching criteria', {
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

        this.logger.debug(`Found ${matchingSpots.length} matching tourist spots`);

        // Step 2: Cluster spots by geographic proximity
        const clusters = this.clusterTouristSpots(matchingSpots, request.clusteringOptions);

        this.logger.debug(`Formed ${clusters.length} geographic clusters`);

        // Step 3: Generate AI content and create routes for each cluster
        const generatedRoutes = await this.generateRoutesFromClusters(
            clusters,
            request.keywords,
            request.maxRoutes || 5,
            request.userId,
        );

        const processingTime = Date.now() - startTime;

        this.logger.info('AI route recommendation generation completed', {
            totalSpotsFound: matchingSpots.length,
            clustersFormed: clusters.length,
            routesGenerated: generatedRoutes.length,
            processingTimeMs: processingTime,
        });

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
     */
    private async findMatchingTouristSpots(
        request: RouteRecommendationRequest,
    ): Promise<TouristSpot[]> {
        // Normalize keywords to lowercase for consistent matching
        const normalizedKeywords = request.keywords.map((k) => k.toLowerCase().trim());

        return await this.modelRouteRepository.findTouristSpotsByHashtags(
            normalizedKeywords,
            request.mode,
            request.region,
        );
    }

    /**
     * Clusters tourist spots by geographic proximity
     */
    private clusterTouristSpots(
        spots: TouristSpot[],
        options?: Partial<ClusteringOptions>,
    ): TouristSpotCluster[] {
        return AiRouteClusteringService.clusterTouristSpots(spots, options);
    }

    /**
     * Generates routes from clusters using AI content generation
     */
    private async generateRoutesFromClusters(
        clusters: TouristSpotCluster[],
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

        for (const cluster of sortedClusters) {
            try {
                this.logger.debug(`Generating content for cluster ${cluster.id}`, {
                    spotCount: cluster.spots.length,
                    region: cluster.region,
                });

                // Generate AI content for the cluster
                const aiContent = await this.aiContentGenerator.generateRouteContent({
                    cluster,
                    userKeywords,
                });

                // Create model route entity with AI-generated content
                const modelRoute = await this.createModelRouteFromCluster(
                    cluster,
                    aiContent,
                    userKeywords,
                    userId,
                );

                generatedRoutes.push({
                    modelRoute,
                    cluster,
                    aiContent,
                    metadata: {
                        sourceKeywords: userKeywords,
                        spotCount: cluster.spots.length,
                        generatedAt: new Date(),
                        algorithm: 'ai-clustering-v1',
                    },
                });

                this.logger.debug(`Successfully generated route: ${aiContent.routeName}`, {
                    clusterId: cluster.id,
                    routeId: modelRoute.modelRouteId,
                });
            } catch (error) {
                this.logger.error(`Failed to generate route for cluster ${cluster.id}`, {
                    error: error.message,
                    clusterId: cluster.id,
                    spotCount: cluster.spots.length,
                });
                // Continue with other clusters even if one fails
            }
        }

        return generatedRoutes;
    }

    /**
     * Creates and saves a new model route entity from cluster and AI content
     */
    private async createModelRouteFromCluster(
        cluster: TouristSpotCluster,
        aiContent: AiGeneratedRouteContent,
        userKeywords: string[],
        userId?: string,
    ): Promise<ModelRouteEntity> {
        const now = new Date();
        const systemUserId = userId || 'ai-system';

        // Select representative background media from cluster spots
        const backgroundMedia = this.selectRepresentativeImage(cluster.spots);

        // Create model route entity with AI-generated content
        const modelRoute = new ModelRouteEntity({
            // AI-generated content
            routeName: aiContent.routeName,
            regionDesc: aiContent.regionDesc,
            recommendation: aiContent.recommendations,

            // Geographic and region data
            region: cluster.region,
            regionLatitude: cluster.centerCoordinates.lat,
            regionLongitude: cluster.centerCoordinates.lng,
            regionBackgroundMedia: backgroundMedia,

            // Metadata
            storyId: undefined, // Standalone AI-generated route
            insUserId: systemUserId,
            insDateTime: now,
            updUserId: systemUserId,
            updDateTime: now,

            // Tourist spots (optional - we might link them or keep as recommendations)
            touristSpotList: [], // Keep empty for now, spots remain independent
        });

        // Save the model route to database
        const savedRoute = await this.modelRouteRepository.createModelRoute(modelRoute);

        this.logger.debug('Created new AI-generated model route', {
            routeId: savedRoute.modelRouteId,
            routeName: aiContent.routeName,
            region: cluster.region,
            spotCount: cluster.spots.length,
        });

        return savedRoute;
    }

    /**
     * Selects a representative image from cluster spots
     */
    private selectRepresentativeImage(spots: TouristSpot[]): string {
        // Look for spots with images
        for (const spot of spots) {
            if (spot.imageSet?.main) {
                return spot.imageSet.main;
            }
        }

        // Fallback to a default image based on region or theme
        return 'https://example.com/default-japan-landscape.jpg';
    }

    /**
     * Validates request parameters
     */
    public validateRequest(request: RouteRecommendationRequest): void {
        if (!request.keywords || request.keywords.length === 0) {
            throw new Error('Keywords are required for route recommendation');
        }

        if (request.keywords.length > 10) {
            throw new Error('Maximum 10 keywords allowed');
        }

        if (request.keywords.some((keyword) => keyword.length > 50)) {
            throw new Error('Keywords must be 50 characters or less');
        }

        if (request.maxRoutes && (request.maxRoutes < 1 || request.maxRoutes > 20)) {
            throw new Error('Max routes must be between 1 and 20');
        }

        if (request.clusteringOptions) {
            AiRouteClusteringService.validateOptions(request.clusteringOptions);
        }
    }

    /**
     * Gets service status and configuration
     */
    public getServiceStatus(): {
        aiAvailable: boolean;
        defaultClusteringOptions: ClusteringOptions;
    } {
        return {
            aiAvailable: this.aiContentGenerator.isAiAvailable(),
            defaultClusteringOptions: {
                proximityRadiusKm: 50,
                minSpotsPerCluster: 2,
                maxSpotsPerCluster: 8,
            },
        };
    }
}
