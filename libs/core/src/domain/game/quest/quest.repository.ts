import type { QuestEntityWithPagination } from "./quest.entity";

export interface QuestRepository {

	/**
	 * Get quests with pagination
	 * @returns QuestEntity[]
	 */
	fetchQuestsWithPagination(
		page: number,
		limit: number,
		isPremium?: boolean,
		isUnlocked?: boolean
	): Promise<QuestEntityWithPagination>
}
