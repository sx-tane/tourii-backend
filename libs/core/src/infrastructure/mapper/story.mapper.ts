import { StoryChapter } from "@app/core/domain/game/story/chapter-story";
import { StoryEntity } from "@app/core/domain/game/story/story.entity";
import type { Prisma, story_chapter } from "@prisma/client";
import type { StoryRelationModel } from "prisma/relation-model/story-relation-model";

// biome-ignore lint/complexity/noStaticOnlyClass: Mapper class is a common pattern for grouping static mapping functions
export class StoryMapper {
	static storyChapterEntityToPrismaInput(
		storyChapterEntity: StoryChapter,
	): Prisma.story_chapterCreateWithoutStoryInput {
		return {
			tourist_spot_id: storyChapterEntity.touristSpotId ?? "",
			chapter_number: storyChapterEntity.chapterNumber ?? "",
			chapter_title: storyChapterEntity.chapterTitle ?? "",
			chapter_desc: storyChapterEntity.chapterDesc ?? "",
			chapter_image: storyChapterEntity.chapterImage ?? "",
			character_name_list: storyChapterEntity.characterNameList ?? [],
			real_world_image: storyChapterEntity.realWorldImage ?? "",
			chapter_video_url: storyChapterEntity.chapterVideoUrl ?? "",
			chapter_video_mobile_url: storyChapterEntity.chapterVideoMobileUrl ?? "",
			chapter_pdf_url: storyChapterEntity.chapterPdfUrl ?? "",
			is_unlocked: storyChapterEntity.isUnlocked ?? false,
			del_flag: storyChapterEntity.delFlag,
			ins_user_id: storyChapterEntity.insUserId,
			ins_date_time: storyChapterEntity.insDateTime,
			upd_user_id: storyChapterEntity.updUserId,
			upd_date_time: storyChapterEntity.updDateTime,
			request_id: storyChapterEntity.requestId ?? null,
		};
	}

	static storyEntityToPrismaInput(
		storyEntity: StoryEntity,
	): Prisma.storyUncheckedCreateInput {
		return {
			story_id: storyEntity.storyId,
			saga_name: storyEntity.sagaName ?? "",
			saga_desc: storyEntity.sagaDesc ?? "",
			background_media: storyEntity.backgroundMedia ?? null,
			map_image: storyEntity.mapImage ?? null,
			location: storyEntity.location ?? null,
			order: storyEntity.order ?? 0,
			is_prologue: storyEntity.isPrologue ?? false,
			is_selected: storyEntity.isSelected ?? false,
			del_flag: storyEntity.delFlag ?? false,
			ins_user_id: storyEntity.insUserId,
			ins_date_time: storyEntity.insDateTime,
			upd_user_id: storyEntity.updUserId,
			upd_date_time: storyEntity.updDateTime,
			request_id: storyEntity.requestId ?? null,
			story_chapter: {
				create: storyEntity.chapterList?.map((chapter) =>
					StoryMapper.storyChapterEntityToPrismaInput(chapter),
				),
			},
		};
	}

	static storyChapterToEntity = (
		prismaModel: story_chapter[],
		sagaName: string,
	): StoryChapter[] => {
		return prismaModel.map((chapter) => {
			return new StoryChapter({
				sagaName: sagaName,
				storyChapterId: chapter.story_chapter_id,
				touristSpotId: chapter.tourist_spot_id,
				chapterNumber: chapter.chapter_number,
				chapterTitle: chapter.chapter_title,
				chapterDesc: chapter.chapter_desc,
				chapterImage: chapter.chapter_image,
				characterNameList: chapter.character_name_list,
				realWorldImage: chapter.real_world_image,
				chapterVideoUrl: chapter.chapter_video_url,
				chapterVideoMobileUrl: chapter.chapter_video_mobile_url,
				chapterPdfUrl: chapter.chapter_pdf_url,
				isUnlocked: chapter.is_unlocked ?? false,
				delFlag: chapter.del_flag ?? false,
				insUserId: chapter.ins_user_id,
				insDateTime: chapter.ins_date_time,
				updUserId: chapter.upd_user_id,
				updDateTime: chapter.upd_date_time,
				requestId: chapter.request_id ?? undefined,
			});
		});
	};

	static prismaModelToStoryEntity(
		prismaModel: StoryRelationModel,
	): StoryEntity {
		return new StoryEntity(
			{
				sagaName: prismaModel.saga_name,
				sagaDesc: prismaModel.saga_desc,
				backgroundMedia: prismaModel.background_media ?? undefined,
				mapImage: prismaModel.map_image ?? undefined,
				location: prismaModel.location ?? undefined,
				order: prismaModel.order,
				isPrologue: prismaModel.is_prologue ?? false,
				isSelected: prismaModel.is_selected ?? false,
				delFlag: prismaModel.del_flag ?? false,
				insUserId: prismaModel.ins_user_id,
				insDateTime: prismaModel.ins_date_time,
				updUserId: prismaModel.upd_user_id,
				updDateTime: prismaModel.upd_date_time,
				requestId: prismaModel.request_id ?? undefined,
				chapterList: prismaModel.story_chapter?.length
					? StoryMapper.storyChapterToEntity(
							prismaModel.story_chapter,
							prismaModel.saga_name,
						)
					: undefined,
			},
			prismaModel.story_id,
		);
	}
}
