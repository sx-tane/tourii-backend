import { Logger } from '@nestjs/common';
import { ContextStorage } from '../../support/context/context-storage';
import { ModelRouteEntity } from '../../domain/game/model-route/model-route.entity';
import { ModelRouteRepository } from '../../domain/game/model-route/model-route.repository';
import { TouristSpot } from '../../domain/game/model-route/tourist-spot';
import { AiContentGeneratorService, AiGeneratedRouteContent } from './ai-content-generator.service';
import {
    AiRouteClusteringService,
    ClusteringOptions,
    TouristSpotCluster,
} from './ai-route-clustering.service';
import { AI_ROUTE_LIMITS, ALGORITHM_VERSIONS, REGION_FALLBACK_IMAGES } from '../../domain/ai-route/ai-route-constants';
import { RegionDetectionUtil } from '../../utils/region-detection.util';


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

// Standard interface for route recommendations
export interface RouteRecommendationResult {
    generatedRoutes: GeneratedRoute[];
    summary: {
        totalSpotsFound: number;
        clustersFormed: number;
        routesGenerated: number;
        processingTimeMs: number;
    };
}

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
            this.logger.log('No tourist spots found matching criteria', {
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

        this.logger.log('AI route recommendation generation completed', {
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
                        generatedAt:
                            ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                        algorithm: ALGORITHM_VERSIONS.AI_CLUSTERING_V1,
                    },
                });

                this.logger.debug(`Successfully generated route: ${aiContent.routeName}`, {
                    clusterId: cluster.id,
                    routeId: modelRoute.modelRouteId,
                });
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                this.logger.error(`Failed to generate route for cluster ${cluster.id}`, {
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
     * Creates and saves a new model route entity from cluster and AI content
     */
    private async createModelRouteFromCluster(
        cluster: TouristSpotCluster,
        aiContent: AiGeneratedRouteContent,
        _userKeywords: string[],
        userId?: string,
    ): Promise<ModelRouteEntity> {
        const now = ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date();
        const systemUserId = userId || 'anonymous-user';

        // Select representative background media from cluster spots
        const backgroundMedia = await this.selectRepresentativeImage(cluster.spots);

        // Create model route entity with AI-generated content
        const modelRoute = new ModelRouteEntity(
            {
                // AI-generated content
                routeName: aiContent.routeName,
                regionDesc: aiContent.regionDesc,
                recommendation: aiContent.recommendations,

                // Geographic and region data
                region: cluster.region,
                regionLatitude: cluster.centerCoordinates.lat,
                regionLongitude: cluster.centerCoordinates.lng,
                regionBackgroundMedia: backgroundMedia,

                // AI generation flag
                isAiGenerated: true,

                // Metadata
                storyId: undefined, // Standalone AI-generated route
                insUserId: systemUserId,
                insDateTime: now,
                updUserId: systemUserId,
                updDateTime: now,

                // Tourist spots - we'll link to existing spots via junction table
                touristSpotList: [], // Empty - we'll populate junction table separately
            },
            undefined,
        );

        // Save the model route to database
        const savedRoute = await this.modelRouteRepository.createModelRoute(modelRoute);

        if (!savedRoute.modelRouteId) {
            throw new Error('Failed to create model route - no ID returned');
        }

        // Create junction table entries to link existing spots to the new route
        await this.linkExistingSpotsToRoute(savedRoute.modelRouteId, cluster.spots, systemUserId);

        this.logger.debug('Created new AI-generated model route', {
            routeId: savedRoute.modelRouteId,
            routeName: aiContent.routeName,
            region: cluster.region,
            spotCount: cluster.spots.length,
        });

        return savedRoute;
    }

    /**
     * Gets real image from LocationInfo API for the first tourist spot in the route
     */
    private async selectRepresentativeImage(spots: TouristSpot[]): Promise<string> {
        if (spots.length === 0) {
            return this.getFallbackImageForRegion('Kanto');
        }

        const firstSpot = spots[0];
        this.logger.debug(
            `Getting real image for route using first spot: ${firstSpot.touristSpotName}`,
        );

        // Try to get real image from LocationInfo API
        const realImage = await this.tryGetRealImage(firstSpot);
        if (realImage) {
            return realImage;
        }

        // Fallback to region-based image
        const region = RegionDetectionUtil.determineRegionFromSpot(firstSpot);
        return this.getFallbackImageForRegion(region);
    }

    /**
     * Attempts to get a real image from LocationInfo API
     */
    private async tryGetRealImage(spot: TouristSpot): Promise<string | null> {
        try {
            const realImage = await this.aiContentGenerator.getLocationImage(
                spot.touristSpotName || '',
                spot.latitude,
                spot.longitude,
                spot.address || undefined,
            );

            if (realImage) {
                this.logger.debug(
                    `Successfully got real image from LocationInfo API: ${realImage}`,
                );
                return realImage;
            }
        } catch (error) {
            this.logger.warn(`Failed to get real image for ${spot.touristSpotName}:`, error);
        }

        return null;
    }

    /**
     * Gets fallback image for a region, trying LocationInfo API first, then curated images
     */
    private async getFallbackImageForRegion(region: string): Promise<string> {
        this.logger.debug(`Getting region fallback image for: ${region}`);

        // Try to get image from an existing route in the region
        const regionImage = await this.tryGetRegionImageFromExistingRoute(region);
        if (regionImage) {
            return regionImage;
        }

        // Final fallback to curated regional images
        const fallbackImage =
            REGION_FALLBACK_IMAGES[region as keyof typeof REGION_FALLBACK_IMAGES] ||
            REGION_FALLBACK_IMAGES.Kanto;
        this.logger.debug(`Using curated fallback image for ${region}: ${fallbackImage}`);
        return fallbackImage;
    }

    /**
     * Attempts to get region image from an existing route's first spot
     */
    private async tryGetRegionImageFromExistingRoute(region: string): Promise<string | null> {
        try {
            const routesInRegion = await this.modelRouteRepository.getModelRoutes();
            const firstRouteInRegion = routesInRegion.find(
                (route) => route.region?.toLowerCase() === region.toLowerCase(),
            );

            if (firstRouteInRegion?.touristSpotList?.length) {
                const firstSpotInRegion = firstRouteInRegion.touristSpotList[0];

                this.logger.debug(
                    `Using first spot from existing route in ${region}: ${firstSpotInRegion.touristSpotName}`,
                );

                const regionImage = await this.aiContentGenerator.getLocationImage(
                    firstSpotInRegion.touristSpotName || '',
                    firstSpotInRegion.latitude,
                    firstSpotInRegion.longitude,
                    firstSpotInRegion.address || undefined,
                );

                if (regionImage) {
                    this.logger.debug(`Got region image from LocationInfo API: ${regionImage}`);
                    return regionImage;
                }
            }
        } catch (error) {
            this.logger.warn(`Failed to get region image for ${region}:`, error);
        }

        return null;
    }

    /**
     * Links existing tourist spots to a route via the junction table
     */
    private async linkExistingSpotsToRoute(
        modelRouteId: string,
        spots: TouristSpot[],
        systemUserId: string,
    ): Promise<void> {
        const junctionRecords = spots
            .map((spot, index) => ({
                modelRouteId,
                touristSpotId: spot.touristSpotId || '',
                displayOrder: index + 1,
                isPrimary: false, // These are references, not primary ownership
                createdBy: systemUserId,
            }))
            .filter((record) => record.touristSpotId !== '');

        await this.modelRouteRepository.createRouteTouristSpotJunctions(junctionRecords);

        this.logger.debug('Linked existing tourist spots to AI route', {
            routeId: modelRouteId,
            spotCount: spots.length,
            spotIds: spots.map((s) => s.touristSpotId),
        });
    }



    // Constants for consistent behavior
    private static readonly SAMPLE_HASHTAGS_FOR_LOGGING = 10;
    private static readonly TOP_HASHTAGS_LIMIT = 20;

    /**
     * Extracts hashtags from routes with frequency counting
     */
    private extractHashtagsFromRoutes(routes: ModelRouteEntity[]): Map<string, number> {
        const hashtagCounts = new Map<string, number>();

        routes
            .flatMap((route) => route.touristSpotList || [])
            .flatMap((spot) => spot.touristSpotHashtag || [])
            .forEach((hashtag) => {
                if (hashtag?.trim()) {
                    const cleanTag = hashtag.trim();
                    hashtagCounts.set(cleanTag, (hashtagCounts.get(cleanTag) || 0) + 1);
                }
            });

        return hashtagCounts;
    }

    /**
     * Fetches all unique hashtags from the database
     */
    private async getAllAvailableHashtags(): Promise<string[]> {
        try {
            const allRoutes = await this.modelRouteRepository.getModelRoutes();
            const hashtagCounts = this.extractHashtagsFromRoutes(allRoutes);
            const uniqueHashtags = [...hashtagCounts.keys()].sort();

            this.logger.debug('Extracted unique hashtags from database', {
                totalHashtags: uniqueHashtags.length,
                sampleHashtags: uniqueHashtags.slice(
                    0,
                    AiRouteRecommendationService.SAMPLE_HASHTAGS_FOR_LOGGING,
                ),
            });

            return uniqueHashtags;
        } catch (error) {
            this.logger.error('Failed to fetch hashtags from database', {
                error: error instanceof Error ? error.message : String(error),
            });
            return [];
        }
    }

    /**
     * Generates new AI routes using expanded keywords (simplified version of original logic)
     */
    private async generateNewRoutes(
        request: RouteRecommendationRequest,
        expandedKeywords: string[],
    ): Promise<{
        generatedRoutes: GeneratedRoute[];
        totalSpotsFound: number;
        clustersFormed: number;
    }> {
        // Find spots using expanded keywords
        const matchingSpots = await this.modelRouteRepository.findTouristSpotsByHashtags(
            expandedKeywords,
            request.mode,
            request.region,
        );

        return this.generateNewRoutesWithCachedData(request, expandedKeywords, [], matchingSpots);
    }

    /**
     * Generates new AI routes using cached data (performance optimized)
     */
    private async generateNewRoutesWithCachedData(
        request: RouteRecommendationRequest,
        expandedKeywords: string[],
        _allRoutes: ModelRouteEntity[],
        precomputedSpots?: TouristSpot[],
    ): Promise<{
        generatedRoutes: GeneratedRoute[];
        totalSpotsFound: number;
        clustersFormed: number;
    }> {
        let matchingSpots: TouristSpot[];

        if (precomputedSpots) {
            matchingSpots = precomputedSpots;
        } else {
            // Find spots using expanded keywords from cached routes if needed
            matchingSpots = await this.modelRouteRepository.findTouristSpotsByHashtags(
                expandedKeywords,
                request.mode,
                request.region,
            );
        }

        if (matchingSpots.length === 0) {
            return {
                generatedRoutes: [],
                totalSpotsFound: 0,
                clustersFormed: 0,
            };
        }

        // Cluster spots
        const clusters = AiRouteClusteringService.clusterTouristSpots(
            matchingSpots,
            request.clusteringOptions,
        );

        // Generate routes from clusters
        const generatedRoutes = await this.generateRoutesFromClusters(
            clusters,
            request.keywords, // Use original keywords for AI generation
            request.maxRoutes || 5,
            request.userId,
        );

        return {
            generatedRoutes,
            totalSpotsFound: matchingSpots.length,
            clustersFormed: clusters.length,
        };
    }

    /**
     * Finds existing routes that match expanded keywords using cached data
     */
    private async findExistingRoutesWithCachedData(
        expandedKeywords: string[],
        region: string | undefined,
        allRoutes: ModelRouteEntity[],
    ): Promise<ModelRouteEntity[]> {
        try {
            const matchingRoutes = allRoutes.filter((route) => {
                // Region filter if specified
                if (
                    region &&
                    route.region &&
                    !route.region.toLowerCase().includes(region.toLowerCase())
                ) {
                    return false;
                }

                // Check if route has tourist spots with matching hashtags
                if (!route.touristSpotList || route.touristSpotList.length === 0) {
                    return false;
                }

                // Check if any spot's hashtags match our expanded keywords
                const routeHashtags = route.touristSpotList
                    .flatMap((spot) => spot.touristSpotHashtag || [])
                    .map((tag) => tag.toLowerCase());

                return expandedKeywords.some((keyword) =>
                    routeHashtags.some(
                        (hashtag) =>
                            hashtag.includes(keyword.toLowerCase()) ||
                            keyword.toLowerCase().includes(hashtag),
                    ),
                );
            });

            // Limit matches and exclude AI-generated routes to avoid duplicates
            return matchingRoutes
                .filter((route) => !route.isAiGenerated)
                .slice(0, AI_ROUTE_LIMITS.EXISTING_ROUTES_LIMIT);
        } catch (error) {
            this.logger.error('Failed to find existing routes with cached data', {
                error: error instanceof Error ? error.message : String(error),
                expandedKeywords,
                region,
            });
            return [];
        }
    }

    /**
     * Finds existing routes that match expanded keywords
     */
    private async findExistingRoutes(
        expandedKeywords: string[],
        region?: string,
    ): Promise<ModelRouteEntity[]> {
        try {
            // Search for existing routes using the expanded keywords
            // We'll use a simplified approach: get all routes and filter by region if specified
            const allRoutes = await this.modelRouteRepository.getModelRoutes();

            const matchingRoutes = allRoutes.filter((route) => {
                // Region filter if specified
                if (
                    region &&
                    route.region &&
                    !route.region.toLowerCase().includes(region.toLowerCase())
                ) {
                    return false;
                }

                // Check if route has tourist spots with matching hashtags
                if (!route.touristSpotList || route.touristSpotList.length === 0) {
                    return false;
                }

                // Check if any spot's hashtags match our expanded keywords
                const routeHashtags = route.touristSpotList
                    .flatMap((spot) => spot.touristSpotHashtag || [])
                    .map((tag) => tag.toLowerCase());

                return expandedKeywords.some((keyword) =>
                    routeHashtags.some(
                        (hashtag) =>
                            hashtag.includes(keyword.toLowerCase()) ||
                            keyword.toLowerCase().includes(hashtag),
                    ),
                );
            });

            // Limit to top 10 matches and exclude AI-generated routes to avoid duplicates
            return matchingRoutes.filter((route) => !route.isAiGenerated).slice(0, 10);
        } catch (error) {
            this.logger.error('Failed to find existing routes', {
                error: error instanceof Error ? error.message : String(error),
                expandedKeywords,
                region,
            });
            return [];
        }
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
     * Gets available hashtags in the database for debugging
     */
    public async getAvailableHashtags(region?: string): Promise<{
        hashtags: string[];
        totalCount: number;
        topHashtags: Array<{ hashtag: string; count: number }>;
    }> {
        try {
            let allRoutes = await this.modelRouteRepository.getModelRoutes();
            
            // Filter by region if specified
            if (region) {
                allRoutes = allRoutes.filter(route => 
                    route.region && route.region.toLowerCase().includes(region.toLowerCase())
                );
            }
            
            const hashtagCounts = this.extractHashtagsFromRoutes(allRoutes);

            const uniqueHashtags = [...hashtagCounts.keys()].sort();
            const topHashtags = [...hashtagCounts.entries()]
                .sort(([, a], [, b]) => b - a)
                .slice(0, AiRouteRecommendationService.TOP_HASHTAGS_LIMIT)
                .map(([hashtag, count]) => ({ hashtag, count }));

            return {
                hashtags: uniqueHashtags,
                totalCount: uniqueHashtags.length,
                topHashtags,
            };
        } catch (error) {
            this.logger.error('Failed to get available hashtags', {
                error: error instanceof Error ? error.message : String(error),
            });
            return {
                hashtags: [],
                totalCount: 0,
                topHashtags: [],
            };
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
