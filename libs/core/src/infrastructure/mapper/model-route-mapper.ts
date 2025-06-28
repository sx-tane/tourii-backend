import { ModelRouteEntity } from '@app/core/domain/game/model-route/model-route.entity';
import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import type { Prisma, tourist_spot } from '@prisma/client';
import { ModelRouteRelationModel } from 'prisma/relation-model/model-route-relation-model';

export class ModelRouteMapper {
    static prismaModelToTouristSpotEntity(prismaModel: tourist_spot): TouristSpot {
        return new TouristSpot({
            touristSpotId: prismaModel.tourist_spot_id,
            storyChapterId: prismaModel.story_chapter_id ?? undefined,
            touristSpotName: prismaModel.tourist_spot_name,
            touristSpotDesc: prismaModel.tourist_spot_desc,
            latitude: prismaModel.latitude,
            longitude: prismaModel.longitude,
            bestVisitTime: prismaModel.best_visit_time ?? undefined,
            address: prismaModel.address ?? undefined,
            storyChapterLink: prismaModel.story_chapter_link ?? undefined,
            touristSpotHashtag: prismaModel.tourist_spot_hashtag,
            imageSet:
                typeof prismaModel.image_set === 'object' &&
                prismaModel.image_set !== null &&
                'main' in prismaModel.image_set &&
                'small' in prismaModel.image_set &&
                typeof (prismaModel.image_set as any).main === 'string' &&
                Array.isArray((prismaModel.image_set as any).small) &&
                (prismaModel.image_set as any).small.every(
                    (item: unknown) => typeof item === 'string',
                )
                    ? (prismaModel.image_set as { main: string; small: string[] })
                    : undefined,
            delFlag: prismaModel.del_flag ?? false,
            insUserId: prismaModel.ins_user_id ?? '',
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: prismaModel.request_id ?? undefined,
        });
    }

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
        modelRouteId?: string,
    ): Prisma.tourist_spotUncheckedCreateInput {
        return {
            model_route_id: modelRouteId ?? null,
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

    static touristSpotToEntity(prismaModel: tourist_spot[]): TouristSpot[] {
        return prismaModel.map((touristSpot) =>
            ModelRouteMapper.prismaModelToTouristSpotEntity(touristSpot),
        );
    }

    static modelRouteEntityToPrismaInput(
        modelRouteEntity: ModelRouteEntity,
    ): Prisma.model_routeUncheckedCreateInput {
        return {
            story_id: modelRouteEntity.storyId,
            route_name: modelRouteEntity.routeName ?? '',
            region: modelRouteEntity.region ?? '',
            region_desc: modelRouteEntity.regionDesc,
            region_latitude: modelRouteEntity.regionLatitude ?? 0,
            region_longitude: modelRouteEntity.regionLongitude ?? 0,
            region_background_media: modelRouteEntity.regionBackgroundMedia,
            recommendation: modelRouteEntity.recommendation ?? [],
            is_ai_generated: modelRouteEntity.isAiGenerated ?? false,
            del_flag: modelRouteEntity.delFlag ?? false,
            ins_user_id: modelRouteEntity.insUserId ?? '',
            ins_date_time: modelRouteEntity.insDateTime,
            upd_user_id: modelRouteEntity.updUserId,
            upd_date_time: modelRouteEntity.updDateTime,
            request_id: modelRouteEntity.requestId,
            // Only create owned tourist spots if there are spots to create
            // AI-generated routes use junction table linking instead
            ...(modelRouteEntity.touristSpotList && modelRouteEntity.touristSpotList.length > 0
                ? {
                      owned_tourist_spots: {
                          create: modelRouteEntity.touristSpotList.map((touristSpot) =>
                              ModelRouteMapper.touristSpotEntityToPrismaInput(touristSpot),
                          ),
                      },
                  }
                : {}),
        };
    }

    static modelRouteEntityToPrismaUpdateInput(
        modelRouteEntity: ModelRouteEntity,
    ): Prisma.model_routeUncheckedUpdateInput {
        return {
            story_id: modelRouteEntity.storyId,
            route_name: modelRouteEntity.routeName,
            region: modelRouteEntity.region,
            region_desc: modelRouteEntity.regionDesc,
            region_latitude: modelRouteEntity.regionLatitude,
            region_longitude: modelRouteEntity.regionLongitude,
            region_background_media: modelRouteEntity.regionBackgroundMedia,
            recommendation: modelRouteEntity.recommendation,
            is_ai_generated: modelRouteEntity.isAiGenerated,
            del_flag: modelRouteEntity.delFlag,
            upd_user_id: modelRouteEntity.updUserId,
            upd_date_time: modelRouteEntity.updDateTime,
            request_id: modelRouteEntity.requestId,
        };
    }

    static touristSpotEntityToPrismaUpdateInput(
        touristSpotEntity: TouristSpot,
    ): Prisma.tourist_spotUncheckedUpdateInput {
        return {
            story_chapter_id: touristSpotEntity.storyChapterId,
            tourist_spot_name: touristSpotEntity.touristSpotName,
            tourist_spot_desc: touristSpotEntity.touristSpotDesc,
            latitude: touristSpotEntity.latitude,
            longitude: touristSpotEntity.longitude,
            best_visit_time: touristSpotEntity.bestVisitTime,
            address: touristSpotEntity.address,
            story_chapter_link: touristSpotEntity.storyChapterLink,
            tourist_spot_hashtag: touristSpotEntity.touristSpotHashtag,
            image_set: touristSpotEntity.imageSet,
            del_flag: touristSpotEntity.delFlag,
            upd_user_id: touristSpotEntity.updUserId,
            upd_date_time: touristSpotEntity.updDateTime,
            request_id: touristSpotEntity.requestId,
        };
    }

    static prismaModelToModelRouteEntity(prismaModel: ModelRouteRelationModel): ModelRouteEntity {
        return new ModelRouteEntity(
            {
                storyId: prismaModel.story_id ?? undefined,
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
                isAiGenerated: prismaModel.is_ai_generated ?? false,
                delFlag: prismaModel.del_flag ?? false,
                insUserId: prismaModel.ins_user_id ?? '',
                insDateTime: prismaModel.ins_date_time,
                updUserId: prismaModel.upd_user_id,
                updDateTime: prismaModel.upd_date_time,
                requestId: prismaModel.request_id ?? undefined,
                touristSpotList: [
                    // Include legacy owned spots
                    ...(prismaModel.owned_tourist_spots || []).map((touristSpot) =>
                        ModelRouteMapper.prismaModelToTouristSpotEntity(touristSpot),
                    ),
                    // Include spots from junction table
                    ...(prismaModel.route_tourist_spots || []).map((junction) =>
                        ModelRouteMapper.prismaModelToTouristSpotEntity(junction.tourist_spot),
                    ),
                ],
            },
            prismaModel.model_route_id,
        );
    }
}
