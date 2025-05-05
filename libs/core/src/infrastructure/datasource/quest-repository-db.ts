// biome-ignore lint/style/useImportType: <explanation>
import { QuestEntityWithPagination } from "@app/core/domain/game/quest/quest.entity";
import { QuestRepository } from "@app/core/domain/game/quest/quest.repository";
import { CachingService } from "@app/core/provider/caching.service";
import { PrismaService } from "@app/core/provider/prisma.service";
import { Injectable } from "@nestjs/common";
import { Prisma, QuestType } from "@prisma/client";
import { QuestMapper } from "../mapper/quest.mapper";

// TTL (Time-To-Live) in seconds
const CACHE_TTL_SECONDS = 3600;

@Injectable()
export class QuestRepositoryDb implements QuestRepository {
	constructor(
		private prisma: PrismaService,
		private cachingService: CachingService,
	) { }

	async fetchQuestsWithPagination(
		page: number,
		limit: number,
		isPremium?: boolean,
		isUnlocked?: boolean,
		questType?: QuestType,
	): Promise<QuestEntityWithPagination> {
		const cacheKey = `quests:${page}:${limit}:${isPremium ?? 'null'}:${isUnlocked ?? 'null'}:${questType ?? 'null'}`;

		const fetchDatafn = async (
			page: number,
			limit: number,
			isPremium?: boolean,
			isUnlocked?: boolean
		): Promise<QuestEntityWithPagination> => {
			const queryFilter: Prisma.questFindManyArgs = {
				where: {
					...(isUnlocked !== undefined && { is_unlocked: isUnlocked }),
					...(isPremium !== undefined && { is_premium: isPremium }),
					...(questType !== undefined && { quest_type: questType }),
				},
				skip: (page - 1) * limit,
				take: limit,
				orderBy: {
					ins_date_time: 'desc'
				},
			}

			const [questDb, total] = await Promise.all([
				this.prisma.quest.findMany(queryFilter),
				this.prisma.quest.count({ where: queryFilter.where })
			])
			const questsEntities = questDb.map((quest) =>
				QuestMapper.prismaModelToQuestEntity(quest),
			);
			return new QuestEntityWithPagination(questsEntities, total, page, limit)
		};

		const questsDb = await this.cachingService.getOrSet<QuestEntityWithPagination>(
			cacheKey,
			() => fetchDatafn(page, limit, isPremium, isUnlocked),
			CACHE_TTL_SECONDS,
		);

		return questsDb ?? QuestEntityWithPagination.default();
	}
}
