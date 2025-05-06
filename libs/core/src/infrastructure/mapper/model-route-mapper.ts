import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import type { Prisma, tourist_spot } from '@prisma/client';
import { ModelRouteRelationModel } from 'prisma/relation-model/model-route-relation-model';
export class ModelRouteMapper {
    static touristSpotEntityToPrismaInput(
        touristSpotEntity: TouristSpot,
    ): Prisma.tourist_spotCreateWithoutModel_routeInput {
        return {
            story_chapter_id: touristSpotEntity.storyChapterId ?? '',
            tourist_spot_name: touristSpotEntity.touristSpotName ?? '',
            tourist_spot_desc: touristSpotEntity.touristSpotDesc ?? '',
            latitude: touristSpotEntity.latitude ?? 0,
            longitude: touristSpotEntity.longitude ?? 0,
            best_visit_time: touristSpotEntity.bestVisitTime ?? null,
            address: touristSpotEntity.address ?? null,
            story_chapter_link: touristSpotEntity.storyChapterLink ?? null,
            tourist_spot_hashtag: touristSpotEntity.touristSpotHashtag ?? [],
            image_set: touristSpotEntity.imageSet ?? undefined,
            del_flag: touristSpotEntity.delFlag ?? false,
            ins_user_id: touristSpotEntity.insUserId ?? '',
            ins_date_time: touristSpotEntity.insDateTime,
            upd_user_id: touristSpotEntity.updUserId,
            upd_date_time: touristSpotEntity.updDateTime,
            request_id: touristSpotEntity.requestId,
        };
    }

    static touristSpotOnlyEntityToPrismaInput(
        touristSpotEntity: TouristSpot,
        modelRouteId: string,
    ): Prisma.tourist_spotUncheckedCreateInput {
        return {
            model_route_id: modelRouteId,
            story_chapter_id: touristSpotEntity.storyChapterId ?? '',
            tourist_spot_name: touristSpotEntity.touristSpotName ?? '',
            tourist_spot_desc: touristSpotEntity.touristSpotDesc ?? '',
            latitude: touristSpotEntity.latitude ?? 0,
            longitude: touristSpotEntity.longitude ?? 0,
            best_visit_time: touristSpotEntity.bestVisitTime ?? null,
            address: touristSpotEntity.address ?? null,
            story_chapter_link: touristSpotEntity.storyChapterLink ?? null,
            tourist_spot_hashtag: touristSpotEntity.touristSpotHashtag ?? [],
            image_set: touristSpotEntity.imageSet ?? undefined,
            del_flag: touristSpotEntity.delFlag ?? false,
            ins_user_id: touristSpotEntity.insUserId ?? '',
            ins_date_time: touristSpotEntity.insDateTime,
            upd_user_id: touristSpotEntity.updUserId,
            upd_date_time: touristSpotEntity.updDateTime,
            request_id: touristSpotEntity.requestId,
        };
    }

    static modelRouteEntityToPrismaInput(
        modelRouteEntity: ModelRouteEntity,
    ): Prisma.model_routeUncheckedCreateInput {
        return {
            story_id: modelRouteEntity.storyId ?? '',
            route_name: modelRouteEntity.routeName ?? '',
            region: modelRouteEntity.region ?? '',
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
                    ModelRouteMapper.touristSpotEntityToPrismaInput(touristSpot),
                ),
            },
        };
    }

    static touristSpotToEntity(prismaModel: tourist_spot[]): TouristSpot[] {
        return prismaModel.map((touristSpot) => {
            return new TouristSpot({
                touristSpotId: touristSpot.tourist_spot_id,
                storyChapterId: touristSpot.story_chapter_id,
                touristSpotName: touristSpot.tourist_spot_name,
                touristSpotDesc: touristSpot.tourist_spot_desc,
                latitude: touristSpot.latitude ?? 0,
                longitude: touristSpot.longitude ?? 0,
                bestVisitTime: touristSpot.best_visit_time ?? undefined,
                address: touristSpot.address ?? undefined,
                storyChapterLink: touristSpot.story_chapter_link ?? undefined,
                touristSpotHashtag: touristSpot.tourist_spot_hashtag ?? [],
                imageSet:
                    // Type guard using explicit `any` cast after checks to satisfy linter
                    typeof touristSpot.image_set === 'object' &&
                    touristSpot.image_set !== null &&
                    'main' in touristSpot.image_set &&
                    'small' in touristSpot.image_set && // Check for 'small' first
                    typeof (touristSpot.image_set as any).main === 'string' && // Cast to any before dot access
                    Array.isArray((touristSpot.image_set as any).small) && // Cast to any before dot access
                    (touristSpot.image_set as any).small.every(
                        (item: unknown) => typeof item === 'string',
                    ) // Cast to any before dot access
                        ? (touristSpot.image_set as { main: string; small: string[] })
                        : undefined,
                delFlag: touristSpot.del_flag ?? false,
                insUserId: touristSpot.ins_user_id ?? '',
                insDateTime: touristSpot.ins_date_time,
                updUserId: touristSpot.upd_user_id,
                updDateTime: touristSpot.upd_date_time,
                requestId: touristSpot.request_id ?? undefined,
            });
        });
    }

    static prismaModelToModelRouteEntity(prismaModel: ModelRouteRelationModel): ModelRouteEntity {
        return new ModelRouteEntity(
            {
                storyId: prismaModel.story_id,
                routeName: prismaModel.route_name,
                region: prismaModel.region,
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
                touristSpotList: ModelRouteMapper.touristSpotToEntity(prismaModel.tourist_spot),
            },
            prismaModel.model_route_id,
        );
    }
}
