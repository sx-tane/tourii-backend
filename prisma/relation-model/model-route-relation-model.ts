import { Prisma } from '@prisma/client';

const ModelRouteRelationModel = Prisma.validator<Prisma.model_routeDefaultArgs>()({
    include: {
        tourist_spot: true,
    },
});

export type ModelRouteRelationModel = Prisma.model_routeGetPayload<typeof ModelRouteRelationModel>;
