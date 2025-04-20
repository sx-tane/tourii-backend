import { StoryChapter } from "@app/core/domain/game/story/chapter-story";
import { StoryEntity } from "@app/core/domain/game/story/story.entity";
import { ContextStorage } from "@app/core/support/context/context-storage";
import type { StoryChapterCreateRequestDto } from "@app/tourii-backend/controller/model/tourii-request/create/chapter-story-request.model";
import type { StoryCreateRequestDto } from "@app/tourii-backend/controller/model/tourii-request/create/story-request.model";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class StoryCreateRequestBuilder {
	static dtoToStoryChapter(
		dto: StoryChapterCreateRequestDto,
		insUserId: string,
	): StoryChapter {
		return new StoryChapter({
			touristSpotId: dto.touristSpotId,
			chapterNumber: dto.chapterNumber,
			chapterTitle: dto.chapterTitle,
			chapterDesc: dto.chapterDesc,
			chapterImage: dto.chapterImage,
			characterNameList: dto.characterNameList,
			realWorldImage: dto.realWorldImage,
			chapterVideoUrl: dto.chapterVideoUrl,
			chapterVideoMobileUrl: dto.chapterVideoMobileUrl,
			chapterPdfUrl: dto.chapterPdfUrl,
			isUnlocked: dto.isUnlocked,
			delFlag: false,
			insUserId: insUserId,
			insDateTime:
				ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
			updUserId: insUserId,
			updDateTime:
				ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
			requestId: ContextStorage.getStore()?.getRequestId()?.value,
		});
	}

	static dtoToStory(
		dto: StoryCreateRequestDto,
		insUserId: string,
	): StoryEntity {
		const processedChapterList = dto.chapterList?.map((chapterDto) =>
			StoryCreateRequestBuilder.dtoToStoryChapter(chapterDto, insUserId),
		);

		return new StoryEntity(
			{
				sagaName: dto.sagaName,
				sagaDesc: dto.sagaDesc,
				backgroundMedia: dto.backgroundMedia,
				mapImage: dto.mapImage,
				location: dto.location,
				order: dto.order,
				isPrologue: dto.isPrologue,
				isSelected: dto.isSelected,
				chapterList: processedChapterList,
				delFlag: false,
				insUserId: insUserId,
				insDateTime:
					ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
				updUserId: insUserId,
				updDateTime:
					ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
				requestId: ContextStorage.getStore()?.getRequestId()?.value,
			},
			undefined,
		);
	}
}
