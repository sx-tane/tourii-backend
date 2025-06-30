import { Prisma } from '@prisma/client';

export type ModelRouteRelationModel = Prisma.model_routeGetPayload<{
    include: {
        owned_tourist_spots: true;
        route_tourist_spots: {
            include: {
                tourist_spot: true;
            };
        };
    };
}>;
