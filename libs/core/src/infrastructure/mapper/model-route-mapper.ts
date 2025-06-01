import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { TouristSpotMapper } from '@app/core/infrastructure/mapper/tourist-spot-mapper';
import type { Prisma, tourist_spot } from '@prisma/client';
import { ModelRouteRelationModel } from 'prisma/relation-model/model-route-relation-model';

export class ModelRouteMapper {
    static touristSpotEntityToPrismaInput(
        touristSpotEntity: TouristSpot,
    ): Prisma.tourist_spotCreateWithoutModel_routeInput {
        return TouristSpotMapper.touristSpotEntityToPrismaInput(touristSpotEntity);
    }

    static touristSpotOnlyEntityToPrismaInput(
        touristSpotEntity: TouristSpot,
        modelRouteId: string,
    ): Prisma.tourist_spotUncheckedCreateInput {
        return TouristSpotMapper.touristSpotOnlyEntityToPrismaInput(
            touristSpotEntity,
            modelRouteId,
        );
    }

    static modelRouteEntityToPrismaInput(
        modelRouteEntity: ModelRouteEntity,
    ): Prisma.model_routeUncheckedCreateInput {
        return {
            story_id: modelRouteEntity.storyId ?? '',
            route_name: modelRouteEntity.routeName ?? '',
            region: modelRouteEntity.region ?? '',
            region_desc: modelRouteEntity.regionDesc,
            region_latitude: modelRouteEntity.regionLatitude ?? 0,
            region_longitude: modelRouteEntity.regionLongitude ?? 0,
            region_background_media: modelRouteEntity.regionBackgroundMedia,
            recommendation: modelRouteEntity.recommendation ?? [],
            del_flag: modelRouteEntity.delFlag ?? false,
            ins_user_id: modelRouteEntity.insUserId ?? '',
            ins_date_time: modelRouteEntity.insDateTime,
            upd_user_id: modelRouteEntity.updUserId,
            upd_date_time: modelRouteEntity.updDateTime,
            request_id: modelRouteEntity.requestId,
            tourist_spot: {
                create: modelRouteEntity.touristSpotList?.map((touristSpot) =>
                    TouristSpotMapper.touristSpotEntityToPrismaInput(touristSpot),
                ),
            },
        };
    }

    static touristSpotToEntity(prismaModel: tourist_spot[]): TouristSpot[] {
        return TouristSpotMapper.touristSpotToEntity(prismaModel);
    }

    static prismaModelToModelRouteEntity(prismaModel: ModelRouteRelationModel): ModelRouteEntity {
        return new ModelRouteEntity(
            {
                storyId: prismaModel.story_id,
                routeName: prismaModel.route_name,
                region: prismaModel.region,
                regionDesc: prismaModel.region_desc ?? undefined,
                regionLatitude: prismaModel.region_latitude,
                regionLongitude: prismaModel.region_longitude,
                regionBackgroundMedia: prismaModel.region_background_media ?? undefined,
                recommendation:
                    Array.isArray(prismaModel.recommendation) &&
                    prismaModel.recommendation.every((item) => typeof item === 'string')
                        ? (prismaModel.recommendation as string[])
                        : [],
                delFlag: prismaModel.del_flag ?? false,
                insUserId: prismaModel.ins_user_id ?? '',
                insDateTime: prismaModel.ins_date_time,
                updUserId: prismaModel.upd_user_id,
                updDateTime: prismaModel.upd_date_time,
                requestId: prismaModel.request_id ?? undefined,
                touristSpotList: TouristSpotMapper.touristSpotToEntity(prismaModel.tourist_spot),
            },
            prismaModel.model_route_id,
        );
    }
}
