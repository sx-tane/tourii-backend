import { QuestType } from '@prisma/client';
import type { QuestEntity, QuestEntityWithPagination } from './quest.entity';

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
}
