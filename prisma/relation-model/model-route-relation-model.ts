import { Prisma } from '@prisma/client';

export type ModelRouteRelationModel = Prisma.model_routeGetPayload<{
    include: {
        tourist_spot: true;
    };
}>;
