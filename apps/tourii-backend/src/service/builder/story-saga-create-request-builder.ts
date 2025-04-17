import { StoryChapter } from "@app/core/domain/story/chapter-story";
import { StorySagaEntity } from "@app/core/domain/story/story.entity";
import { ContextStorage } from "@app/core/support/context/context-storage";
import type { StorySagaCreateRequestDto } from "@app/tourii-backend/controller/model/tourii-request/create/story-saga-request.model";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class StorySagaCreateRequestBuilder {
	static dtoToStoryChapter(dto: StoryChapter, insUserId: string): StoryChapter {
		return new StoryChapter({
			...dto,
			insUserId: insUserId,
			insDateTime:
				ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
			updUserId: insUserId,
			updDateTime:
				ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
			requestId: ContextStorage.getStore()?.getRequestId()?.toString(),
		});
	}

	static dtoToStorySaga(
		dto: StorySagaCreateRequestDto,
		insUserId: string,
		chapterList?: StoryChapter[],
	): StorySagaEntity {
		return new StorySagaEntity(
			{
				...dto,
				chapterList: chapterList ? chapterList : undefined,
				insUserId: insUserId,
				insDateTime:
					ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
				updUserId: insUserId,
				updDateTime:
					ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
				requestId: ContextStorage.getStore()?.getRequestId()?.toString(),
			},
			undefined,
		);
	}
}
