import { StoryStatus } from '@prisma/client';

export interface StoryCompletionResult {
    /** Story chapter information */
    chapter: {
        storyChapterId: string;
        chapterTitle: string;
        status: StoryStatus;
        completedAt: Date | null;
    };
    /** Unlocked quests at the associated tourist spot */
    unlockedQuests: Array<{
        questId: string;
        questName: string;
        questDesc: string;
        questImage: string | null;
        touristSpotName: string;
        totalMagatamaPointAwarded: number;
        isPremium: boolean;
    }>;
    /** Rewards earned from story completion */
    rewards: {
        magatamaPointsEarned: number;
        achievementsUnlocked: string[];
    };
}

export interface UserStoryLogRepository {
    /**
     * Track user reading progress for a chapter
     * @param userId user identifier
     * @param chapterId chapter identifier
     * @param status story status
     */
    trackProgress(userId: string, chapterId: string, status: StoryStatus): Promise<void>;

    /**
     * Complete story reading with quest unlocking and rewards
     * @param userId user identifier
     * @param chapterId chapter identifier
     * @returns story completion result with unlocked quests and rewards
     */
    completeStoryWithQuestUnlocking(
        userId: string,
        chapterId: string,
    ): Promise<StoryCompletionResult>;

    /**
     * Start story reading (set status to IN_PROGRESS)
     * @param userId user identifier
     * @param chapterId chapter identifier
     */
    startStoryReading(userId: string, chapterId: string): Promise<void>;

    /**
     * Get story reading progress for a user and chapter
     * @param userId user identifier
     * @param chapterId chapter identifier
     * @returns current story status and timestamps
     */
    getStoryProgress(
        userId: string,
        chapterId: string,
    ): Promise<{
        status: StoryStatus;
        unlockedAt: Date | null;
        finishedAt: Date | null;
    } | null>;
}
