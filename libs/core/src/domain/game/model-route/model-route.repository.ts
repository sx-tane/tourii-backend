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
     * @param modelRouteId
     * @returns TouristSpot
     */
    createTouristSpot(touristSpot: TouristSpot, modelRouteId: string): Promise<TouristSpot>;

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
}
