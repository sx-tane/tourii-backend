import { ModelRouteEntity } from './model-route.entity';
import { TouristSpot } from './tourist-spot';

export interface ModelRouteRepository {
    /**
     * Create model route
     * @param modelRoute
     * @returns ModelRouteEntity
     */
    createModelRoute(modelRoute: ModelRouteEntity): Promise<ModelRouteEntity>;

    /**
     * Create tourist spot
     * @param touristSpot
     * @param modelRouteId Optional model route ID (for legacy compatibility)
     * @returns TouristSpot
     */
    createTouristSpot(touristSpot: TouristSpot, modelRouteId?: string): Promise<TouristSpot>;

    /**
     * Update model route
     * @param modelRoute Updated model route entity
     * @returns ModelRouteEntity
     */
    updateModelRoute(modelRoute: ModelRouteEntity): Promise<ModelRouteEntity>;

    /**
     * Update tourist spot
     * @param touristSpot Updated tourist spot entity
     * @returns TouristSpot
     */
    updateTouristSpot(touristSpot: TouristSpot): Promise<TouristSpot>;

    /**
     * Get tourist spots by story chapter id
     * @param storyChapterId story chapter identifier
     * @returns list of TouristSpot entities
     */
    getTouristSpotsByStoryChapterId(storyChapterId: string): Promise<TouristSpot[]>;

    /**
     * Get model route by model route id
     * @param modelRouteId
     * @returns ModelRouteEntity
     */
    getModelRouteByModelRouteId(modelRouteId: string): Promise<ModelRouteEntity>;

    /**
     * Get all model routes
     * @returns ModelRouteEntity[]
     */
    getModelRoutes(): Promise<ModelRouteEntity[]>;

    /**
     * Create a tourist-generated route (non-AI route created by users)
     * @param routeName Route name
     * @param regionDesc Route description
     * @param recommendations Array of recommendation strings
     * @param touristSpotIds Array of existing tourist spot IDs to include
     * @param userId User creating the route
     * @returns Created ModelRouteEntity
     */
    createTouristRoute(
        routeName: string,
        regionDesc: string,
        recommendations: string[],
        touristSpotIds: string[],
        userId: string,
    ): Promise<ModelRouteEntity>;

    /**
     * Get unified routes with filtering options
     * @param filters Filtering options
     * @returns Array of ModelRouteEntity matching filters
     */
    getUnifiedRoutes(filters?: {
        source?: 'ai' | 'manual' | 'all';
        region?: string;
        userId?: string;
        limit?: number;
        offset?: number;
    }): Promise<ModelRouteEntity[]>;

    /**
     * Delete model route and its tourist spots
     * @param modelRouteId Model route ID
     */
    deleteModelRoute(modelRouteId: string): Promise<boolean>;

    /**
     * Delete tourist spot
     * @param touristSpotId Tourist spot ID
     */
    deleteTouristSpot(touristSpotId: string): Promise<boolean>;

    /**
     * Get all tourist spots for AI recommendation processing
     * @returns All TouristSpot entities
     */
    getAllTouristSpots(): Promise<TouristSpot[]>;

    /**
     * Find tourist spots by hashtags for AI route generation
     * @param hashtags Array of hashtags to match
     * @param mode Matching mode - 'all' requires all hashtags, 'any' requires any hashtag
     * @param region Optional region filter
     * @returns TouristSpot entities matching the criteria
     */
    findTouristSpotsByHashtags(
        hashtags: string[],
        mode: 'all' | 'any',
        region?: string,
    ): Promise<TouristSpot[]>;

    /**
     * Create junction table records to link tourist spots to a route
     * @param junctionRecords Array of junction records to create
     */
    createRouteTouristSpotJunctions(
        junctionRecords: Array<{
            modelRouteId: string;
            touristSpotId: string;
            displayOrder: number;
            isPrimary: boolean;
            createdBy: string;
        }>,
    ): Promise<void>;
}
