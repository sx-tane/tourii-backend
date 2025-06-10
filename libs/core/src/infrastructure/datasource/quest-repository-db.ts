import {
    QuestEntity,
    QuestEntityWithPagination,
    QuestWithTasks,
} from '@app/core/domain/game/quest/quest.entity';
import { QuestRepository } from '@app/core/domain/game/quest/quest.repository';
import { Task } from '@app/core/domain/game/quest/task';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, QuestType } from '@prisma/client';
import { QuestMapper } from '../mapper/quest.mapper';

// TTL (Time-To-Live) in seconds
const CACHE_TTL_SECONDS = 3600;

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
        userId?: string,
    ): Promise<QuestEntityWithPagination> {
        const questCacheKey = `quests:${page}:${limit}:${isPremium ?? 'null'}:${isUnlocked ?? 'null'}:${questType ?? 'null'}`;

        const fetchQuestsDatafn = async (): Promise<{
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
        } | null>(questCacheKey, fetchQuestsDatafn, CACHE_TTL_SECONDS);

        if (!cachedData) {
            this.logger.warn(`No quests found for key: ${questCacheKey}`);
            return QuestEntityWithPagination.default();
        }

        const userCompletedTasksCacheKey = `user-completed-tasks:${userId}`;

        const fetchUserCompletedTasksDatafn = async (userId: string): Promise<string[]> => {
            return this.prisma.user_travel_log
                .findMany({
                    select: { task_id: true },
                    where: { user_id: userId },
                    distinct: ['task_id'],
                })
                .then((tasks) => tasks.map((task) => task.task_id));
        };

        const userCompletedTasks = userId
            ? ((await this.cachingService.getOrSet<string[]>(
                  userCompletedTasksCacheKey,
                  () => fetchUserCompletedTasksDatafn(userId),
                  CACHE_TTL_SECONDS,
              )) ?? new Array<string>())
            : new Array<string>();

        const questsEntities = cachedData.quests.map((quest) =>
            QuestMapper.prismaModelToQuestEntityWithUserCompletedTasks(quest, userCompletedTasks),
        );

        const result = new QuestEntityWithPagination(questsEntities, cachedData.total, page, limit);
        return result;
    }

    async fetchQuestById(questId: string, userId?: string): Promise<QuestEntity> {
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

        const completedTasks = userId
            ? await this.prisma.user_travel_log
                  .findMany({
                      where: {
                          user_id: userId,
                          quest_id: questId,
                      },
                      select: { task_id: true },
                  })
                  .then((tasks) => tasks.map((task) => task.task_id))
            : new Array<string>();

        return QuestMapper.prismaModelToQuestEntityWithUserCompletedTasks(questDb, completedTasks);
    }

    async createQuest(quest: QuestEntity): Promise<QuestEntity> {
        const created = (await this.prisma.quest.create({
            data: QuestMapper.questEntityToPrismaInput(quest),
            include: { quest_task: true, tourist_spot: true },
        })) as QuestWithTasks;

        // Clear all quest-related cache entries
        await this.cachingService.clearAll();
        return QuestMapper.prismaModelToQuestEntity(created);
    }

    async createQuestTask(task: Task): Promise<Task> {
        const created = await this.prisma.quest_task.create({
            data: QuestMapper.taskEntityToPrismaInput(task),
        });
        // Clear all quest-related cache entries
        await this.cachingService.clearAll();
        return QuestMapper.prismaTaskModelToTaskEntity(created);
    }

    async updateQuest(quest: QuestEntity): Promise<QuestEntity> {
        const updated = (await this.prisma.quest.update({
            where: { quest_id: quest.questId },
            data: QuestMapper.questEntityToPrismaUpdateInput(quest),
            include: { quest_task: true, tourist_spot: true },
        })) as QuestWithTasks;

        // Clear all quest-related cache entries
        await this.cachingService.clearAll();
        return QuestMapper.prismaModelToQuestEntity(updated);
    }

    async updateQuestTask(task: Task): Promise<Task> {
        const updated = await this.prisma.quest_task.update({
            where: { quest_task_id: task.taskId },
            data: QuestMapper.taskEntityToPrismaUpdateInput(task),
        });

        // Clear all cache to ensure consistency
        await this.cachingService.clearAll();
        return QuestMapper.prismaTaskModelToTaskEntity(updated);
    }

    async deleteQuest(questId: string): Promise<boolean> {
        await this.prisma.$transaction([
            this.prisma.quest_task.deleteMany({ where: { quest_id: questId } }),
            this.prisma.quest.delete({ where: { quest_id: questId } }),
        ]);
        // Clear all cache to ensure consistency
        await this.cachingService.clearAll();
        return true;
    }

    async deleteQuestTask(taskId: string): Promise<boolean> {
        await this.prisma.quest_task.delete({ where: { quest_task_id: taskId } });
        // Clear all cache to ensure consistency
        await this.cachingService.clearAll();
        return true;
    }
}
