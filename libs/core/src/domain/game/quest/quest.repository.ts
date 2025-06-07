import { QuestType, RewardType, TaskTheme, TaskType } from '@prisma/client';
import type { QuestEntity, QuestEntityWithPagination } from './quest.entity';
import type { Task } from './task';

export interface QuestRepository {
    /**
     * Get quests with pagination
     * @returns QuestEntity[]
     */
    fetchQuestsWithPagination(
        page: number,
        limit: number,
        isPremium?: boolean,
        isUnlocked?: boolean,
        questType?: QuestType,
    ): Promise<QuestEntityWithPagination>;

    fetchQuestById(questId: string): Promise<QuestEntity>;

    updateQuest(data: {
        questId: string;
        touristSpotId: string;
        questName: string;
        questDesc: string;
        questImage?: string;
        questType: QuestType;
        isUnlocked: boolean;
        isPremium: boolean;
        totalMagatamaPointAwarded: number;
        rewardType: RewardType;
        delFlag: boolean;
        updUserId: string;
    }): Promise<QuestEntity>;

    updateQuestTask(data: {
        taskId: string;
        questId: string;
        taskTheme: TaskTheme;
        taskType: TaskType;
        taskName: string;
        taskDesc: string;
        isUnlocked: boolean;
        requiredAction: string;
        groupActivityMembers?: any[];
        selectOptions?: any[];
        antiCheatRules: any;
        magatamaPointAwarded: number;
        totalMagatamaPointAwarded: number;
        delFlag: boolean;
        updUserId: string;
    }): Promise<Task>;
}
