import type { StoryChapter } from "@app/core/domain/game/story/chapter-story";
import type { StorySagaEntity } from "@app/core/domain/game/story/story.entity";
import { TransformDate } from "@app/core/support/transformer/date-transformer";
import type { StoryChapterResponseDto } from "@app/tourii-backend/controller/model/tourii-response/chapter-story-response.model";
import type { StorySagaResponseDto } from "@app/tourii-backend/controller/model/tourii-response/story-saga-response.model";

export class StorySagaResultBuilder {
	storyChapterToDto(storyChapter: StoryChapter): StoryChapterResponseDto {
		return {
			storyId: storyChapter.storyId ?? "",
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

	storySagaToDto(storySaga: StorySagaEntity): StorySagaResponseDto {
		return {
			sagaId: storySaga.sagaId ?? "",
			sagaName: storySaga.sagaName ?? "",
			sagaDesc: storySaga.sagaDesc ?? "",
			backgroundMedia: storySaga.backgroundMedia ?? "",
			mapImage: storySaga.mapImage ?? "",
			location: storySaga.location ?? "",
			order: storySaga.order ?? 0,
			isPrologue: storySaga.isPrologue ?? false,
			isSelected: storySaga.isSelected ?? false,
			chapterList:
				storySaga.chapterList?.map((chapter) =>
					this.storyChapterToDto(chapter),
				) ?? undefined,
			insUserId: storySaga.insUserId,
			insDateTime:
				TransformDate.transformDateToYYYYMMDDHHmm(storySaga.insDateTime) ?? "",
			updUserId: storySaga.updUserId,
			updDateTime:
				TransformDate.transformDateToYYYYMMDDHHmm(storySaga.updDateTime) ?? "",
		};
	}
}
