import { QuestEntity, QuestEntityWithPagination } from '@app/core/domain/game/quest/quest.entity';
import { QuestRepository } from '@app/core/domain/game/quest/quest.repository';
import { Task } from '@app/core/domain/game/quest/task';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, QuestType, quest, quest_task, tourist_spot } from '@prisma/client';
import { QuestMapper } from '../mapper/quest.mapper';

// TTL (Time-To-Live) in seconds
const CACHE_TTL_SECONDS = 3600;

type QuestWithTasks = quest & {
    quest_task: quest_task[] | undefined;
    tourist_spot: tourist_spot | undefined;
};

@Injectable()
export class QuestRepositoryDb implements QuestRepository {
    private readonly logger = new Logger(QuestRepositoryDb.name);

    constructor(
        private prisma: PrismaService,
        private cachingService: CachingService,
    ) {}

    async fetchQuestsWithPagination(
        page: number,
        limit: number,
        isPremium?: boolean,
        isUnlocked?: boolean,
        questType?: QuestType,
    ): Promise<QuestEntityWithPagination> {
        const cacheKey = `quests:${page}:${limit}:${isPremium ?? 'null'}:${isUnlocked ?? 'null'}:${questType ?? 'null'}`;

        const fetchDatafn = async (): Promise<{
            quests: QuestWithTasks[];
            total: number;
        } | null> => {
            const queryFilter: Prisma.questFindManyArgs = {
                where: {
                    ...(isUnlocked !== undefined && { is_unlocked: isUnlocked }),
                    ...(isPremium !== undefined && { is_premium: isPremium }),
                    ...(questType !== undefined && { quest_type: questType }),
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: {
                    ins_date_time: 'desc',
                },
                include: {
                    quest_task: true,
                    tourist_spot: true,
                },
            };

            const [questDb, total] = await Promise.all([
                this.prisma.quest.findMany(queryFilter) as Promise<QuestWithTasks[]>,
                this.prisma.quest.count({ where: queryFilter.where }),
            ]);

            return { quests: questDb, total };
        };

        const cachedData = await this.cachingService.getOrSet<{
            quests: QuestWithTasks[];
            total: number;
        } | null>(cacheKey, fetchDatafn, CACHE_TTL_SECONDS);

        if (!cachedData) {
            this.logger.warn(`No quests found for key: ${cacheKey}`);
            return QuestEntityWithPagination.default();
        }

        // Map raw Prisma data to entities after cache retrieval
        const questsEntities = cachedData.quests.map((quest) =>
            QuestMapper.prismaModelToQuestEntity(quest),
        );

        const result = new QuestEntityWithPagination(questsEntities, cachedData.total, page, limit);
        return result;
    }

    async fetchQuestById(questId: string): Promise<QuestEntity> {
        const questDb = (await this.prisma.quest.findUnique({
            where: { quest_id: questId },
            include: {
                quest_task: true,
                tourist_spot: true,
            },
        })) as QuestWithTasks | null;
        if (!questDb) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }
        return QuestMapper.prismaModelToQuestEntity(questDb);
    }

    async createQuest(quest: QuestEntity): Promise<QuestEntity> {
        const created = (await this.prisma.quest.create({
            data: QuestMapper.questEntityToPrismaInput(quest),
            include: { quest_task: true, tourist_spot: true },
        })) as QuestWithTasks;

        await this.cachingService.invalidate('quests:*');
        return QuestMapper.prismaModelToQuestEntity(created);
    }

    async createQuestTask(task: Task): Promise<Task> {
        const created = await this.prisma.quest_task.create({
            data: QuestMapper.taskEntityToPrismaInput(task),
        });
        await this.cachingService.invalidate('quests:*');
        return QuestMapper.prismaTaskModelToTaskEntity(created);
    }

    async updateQuest(quest: QuestEntity): Promise<QuestEntity> {
        const updated = (await this.prisma.quest.update({
            where: { quest_id: quest.questId },
            data: QuestMapper.questEntityToPrismaUpdateInput(quest),
            include: { quest_task: true, tourist_spot: true },
        })) as QuestWithTasks;

        await this.cachingService.invalidate('quests:*');
        return QuestMapper.prismaModelToQuestEntity(updated);
    }

    async updateQuestTask(task: Task): Promise<Task> {
        const updated = await this.prisma.quest_task.update({
            where: { quest_task_id: task.taskId },
            data: QuestMapper.taskEntityToPrismaUpdateInput(task),
        });

        return QuestMapper.prismaTaskModelToTaskEntity(updated);
    }

    async deleteQuest(questId: string): Promise<boolean> {
        await this.prisma.$transaction([
            this.prisma.quest_task.deleteMany({ where: { quest_id: questId } }),
            this.prisma.quest.delete({ where: { quest_id: questId } }),
        ]);
        await this.cachingService.invalidate('quests:*');
        return true;
    }

    async deleteQuestTask(taskId: string): Promise<boolean> {
        await this.prisma.quest_task.delete({ where: { quest_task_id: taskId } });
        await this.cachingService.invalidate('quests:*');
        return true;
    }
}
