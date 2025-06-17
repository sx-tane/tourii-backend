import { QuestType } from '@prisma/client';
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
        userId?: string,
    ): Promise<QuestEntityWithPagination>;

    /**
     * Get quest by ID
     * @param questId Quest ID
     * @param userId User ID (optional)
     * @returns Quest entity
     */
    fetchQuestById(questId: string, userId?: string): Promise<QuestEntity>;

    /**
     * Get quests by tourist spot ID
     * @param touristSpotId Tourist spot ID
     * @param userId User ID (optional)
     */
    fetchQuestsByTouristSpotId(touristSpotId: string, userId?: string): Promise<QuestEntity[]>;

    /**
     * Create quest
     * @param quest Quest entity
     * @returns Quest entity
     */
    createQuest(quest: QuestEntity): Promise<QuestEntity>;

    /**
     * Create quest task
     * @param task Task entity
     * @returns Task entity
     */
    createQuestTask(task: Task, questId: string): Promise<Task>;

    /**
     * Update quest
     * @param quest Quest entity
     * @returns Quest entity
     */
    updateQuest(quest: QuestEntity): Promise<QuestEntity>;

    /**
     * Update quest task
     * @param task Task entity
     * @returns Task entity
     */
    updateQuestTask(task: Task): Promise<Task>;

    /**
     * Delete quest and its tasks
     * @param questId Quest ID
     */
    deleteQuest(questId: string): Promise<boolean>;

    /**
     * Delete quest task
     * @param taskId Task ID
     */
    deleteQuestTask(taskId: string): Promise<boolean>;

    /**
     * Check if all tasks for a quest are completed by user
     */
    isQuestCompleted(questId: string, userId: string): Promise<boolean>;

    /**
     * Retrieve the top 3 quests with the highest number of completed tasks.
     */
    getMostPopularQuest(): Promise<QuestEntity[]>;
}
