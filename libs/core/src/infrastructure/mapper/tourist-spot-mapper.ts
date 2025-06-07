import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import type { Prisma, tourist_spot } from '@prisma/client';

export class TouristSpotMapper {
    static prismaModelToTouristSpotEntity(prismaModel: tourist_spot): TouristSpot {
        return new TouristSpot({
            touristSpotId: prismaModel.tourist_spot_id,
            storyChapterId: prismaModel.story_chapter_id,
            touristSpotName: prismaModel.tourist_spot_name,
            touristSpotDesc: prismaModel.tourist_spot_desc,
            latitude: prismaModel.latitude,
            longitude: prismaModel.longitude,
            bestVisitTime: prismaModel.best_visit_time ?? undefined,
            address: prismaModel.address ?? undefined,
            storyChapterLink: prismaModel.story_chapter_link ?? undefined,
            touristSpotHashtag: prismaModel.tourist_spot_hashtag,
            imageSet:
                // Type guard using explicit `any` cast after checks to satisfy linter
                typeof prismaModel.image_set === 'object' &&
                prismaModel.image_set !== null &&
                'main' in prismaModel.image_set &&
                'small' in prismaModel.image_set && // Check for 'small' first
                typeof (prismaModel.image_set as any).main === 'string' && // Cast to any before dot access
                Array.isArray((prismaModel.image_set as any).small) && // Cast to any before dot access
                (prismaModel.image_set as any).small.every(
                    (item: unknown) => typeof item === 'string',
                ) // Cast to any before dot access
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

    static touristSpotToEntity(prismaModel: tourist_spot[]): TouristSpot[] {
        return prismaModel.map((touristSpot) =>
            TouristSpotMapper.prismaModelToTouristSpotEntity(touristSpot),
        );
    }
}
