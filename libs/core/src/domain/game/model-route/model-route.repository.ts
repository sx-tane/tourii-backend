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
