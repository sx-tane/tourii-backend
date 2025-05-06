import { ModelRouteEntity } from './model-route.entity';

export interface ModelRouteRepository {
    /**
     * Create model route
     * @param modelRoute
     * @returns ModelRouteEntity
     */
    createModelRoute(modelRoute: ModelRouteEntity): Promise<ModelRouteEntity>;
}
