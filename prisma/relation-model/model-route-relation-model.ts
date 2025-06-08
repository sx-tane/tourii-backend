import { Prisma } from '@prisma/client';

const modelRouteInclude = Prisma.validator<Prisma.model_routeInclude>()({
    tourist_spot: true,
});

export type ModelRouteRelationModel = Prisma.model_routeGetPayload<{
    include: typeof modelRouteInclude;
}>;
