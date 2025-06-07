import { StoryChapter } from '@app/core/domain/game/story/chapter-story';
import { StoryEntity } from '@app/core/domain/game/story/story.entity';
import { ContextStorage } from '@app/core/support/context/context-storage';
import type { StoryChapterUpdateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/update/chapter-story-update-request.model';
import type { StoryUpdateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/update/story-update-request.model';

export class StoryUpdateRequestBuilder {
    static dtoToStory(dto: StoryUpdateRequestDto): StoryEntity {
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
                delFlag: dto.delFlag,
                updUserId: dto.updUserId,
                updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
            },
            dto.sagaId,
        );
    }

    static dtoToStoryChapter(dto: StoryChapterUpdateRequestDto): StoryChapter {
        return new StoryChapter({
            storyChapterId: dto.storyChapterId,
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
            delFlag: dto.delFlag,
            updUserId: dto.updUserId,
            updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
        });
    }
}
