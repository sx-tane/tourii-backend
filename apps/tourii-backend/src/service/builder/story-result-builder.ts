import type { StoryChapter } from "@app/core/domain/game/story/chapter-story";
import type { StoryEntity } from "@app/core/domain/game/story/story.entity";
import { TransformDate } from "@app/core/support/transformer/date-transformer";
import type { StoryChapterResponseDto } from "@app/tourii-backend/controller/model/tourii-response/chapter-story-response.model";
import type { StoryResponseDto } from "@app/tourii-backend/controller/model/tourii-response/story-response.model";
import { Logger } from "@nestjs/common";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class StoryResultBuilder {
	static storyChapterToDto(
		storyChapter: StoryChapter,
		storyId: string,
	): StoryChapterResponseDto {
		return {
			storyId: storyId,
			sagaName: storyChapter.sagaName ?? "",
			storyChapterId: storyChapter.storyChapterId ?? "",
			touristSpotId: storyChapter.touristSpotId ?? "",
			chapterNumber: storyChapter.chapterNumber ?? "",
			chapterTitle: storyChapter.chapterTitle ?? "",
			chapterDesc: storyChapter.chapterDesc ?? "",
			chapterImage: storyChapter.chapterImage ?? "",
			characterNameList: storyChapter.characterNameList ?? [],
			realWorldImage: storyChapter.realWorldImage ?? "",
			chapterVideoUrl: storyChapter.chapterVideoUrl ?? "",
			chapterVideoMobileUrl: storyChapter.chapterVideoMobileUrl ?? "",
			chapterPdfUrl: storyChapter.chapterPdfUrl ?? "",
			isUnlocked: storyChapter.isUnlocked ?? false,
			insUserId: storyChapter.insUserId,
			insDateTime:
				TransformDate.transformDateToYYYYMMDDHHmm(storyChapter.insDateTime) ??
				"",
			updUserId: storyChapter.updUserId,
			updDateTime:
				TransformDate.transformDateToYYYYMMDDHHmm(storyChapter.updDateTime) ??
				"",
		};
	}

	static storyToDto(story: StoryEntity): StoryResponseDto {
		return {
			storyId: story.storyId ?? "",
			sagaName: story.sagaName ?? "",
			sagaDesc: story.sagaDesc ?? "",
			backgroundMedia: story.backgroundMedia ?? "",
			mapImage: story.mapImage ?? "",
			location: story.location ?? "",
			order: story.order ?? 0,
			isPrologue: story.isPrologue ?? false,
			isSelected: story.isSelected ?? false,
			chapterList:
				story.chapterList?.map((chapter) =>
					StoryResultBuilder.storyChapterToDto(chapter, story.storyId ?? ""),
				) ?? undefined,
			insUserId: story.insUserId,
			insDateTime:
				TransformDate.transformDateToYYYYMMDDHHmm(story.insDateTime) ?? "",
			updUserId: story.updUserId,
			updDateTime:
				TransformDate.transformDateToYYYYMMDDHHmm(story.updDateTime) ?? "",
		};
	}
}
