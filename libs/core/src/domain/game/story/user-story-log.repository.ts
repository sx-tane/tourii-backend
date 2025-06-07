import { StoryStatus } from '@prisma/client';

export interface UserStoryLogRepository {
    /**
     * Track user reading progress for a chapter
     * @param userId user identifier
     * @param chapterId chapter identifier
     * @param status story status
     */
    trackProgress(userId: string, chapterId: string, status: StoryStatus): Promise<void>;
}
