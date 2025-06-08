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

    createQuest(quest: QuestEntity): Promise<QuestEntity>;

    createQuestTask(task: Task): Promise<Task>;

    updateQuest(quest: QuestEntity): Promise<QuestEntity>;

    updateQuestTask(task: Task): Promise<Task>;
}
