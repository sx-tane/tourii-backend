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
import { Prisma, QuestType, TaskStatus } from '@prisma/client';
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

        const fetchUserCompletedTasksDatafn = async (
            userId: string,
        ): Promise<{ quest_id: string; task_id: string }[]> => {
            return this.prisma.user_task_log.findMany({
                select: { quest_id: true, task_id: true },
                where: { user_id: userId, status: TaskStatus.COMPLETED },
            });
        };

        const userCompletedTasks = userId
            ? ((await this.cachingService.getOrSet<{ quest_id: string; task_id: string }[]>(
                  userCompletedTasksCacheKey,
                  () => fetchUserCompletedTasksDatafn(userId),
                  CACHE_TTL_SECONDS,
              )) ?? [])
            : [];

        const completedTaskMap = new Map<string, Set<string>>();
        userCompletedTasks.forEach((log) => {
            if (!completedTaskMap.has(log.quest_id)) {
                completedTaskMap.set(log.quest_id, new Set());
            }
            completedTaskMap.get(log.quest_id)?.add(log.task_id);
        });

        const questsEntities = cachedData.quests.map((quest) => {
            return QuestMapper.prismaModelToQuestEntityWithUserCompletedTasks(
                quest,
                userCompletedTasks.map((log) => log.task_id),
            );
        });

        const result = new QuestEntityWithPagination(questsEntities, cachedData.total, page, limit);
        return result;
    }

    async fetchQuestById(questId: string, userId?: string): Promise<QuestEntity> {
        const questCacheKey = `quest:${questId}`;

        const fetchQuestDataFn = async (): Promise<QuestWithTasks | null> => {
            return await this.prisma.quest.findUnique({
                where: { quest_id: questId },
                include: {
                    quest_task: true,
                    tourist_spot: true,
                },
            });
        };

        const questDb = await this.cachingService.getOrSet<QuestWithTasks | null>(
            questCacheKey,
            fetchQuestDataFn,
            CACHE_TTL_SECONDS,
        );

        if (!questDb) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_023);
        }

        const userCompletedTasksCacheKey = `user-completed-tasks:${userId}:${questId}`;

        const fetchUserCompletedTasksDataFn = async (userId: string): Promise<string[]> => {
            return this.prisma.user_task_log
                .findMany({
                    where: {
                        user_id: userId,
                        quest_id: questId,
                        status: TaskStatus.COMPLETED,
                    },
                    select: { task_id: true },
                })
                .then((logs) => logs.map((log) => log.task_id));
        };

        const completedTasksForQuest = userId
            ? ((await this.cachingService.getOrSet<string[]>(
                  userCompletedTasksCacheKey,
                  () => fetchUserCompletedTasksDataFn(userId),
                  CACHE_TTL_SECONDS,
              )) ?? [])
            : [];

        return QuestMapper.prismaModelToQuestEntityWithUserCompletedTasks(
            questDb,
            completedTasksForQuest,
        );
    }

    /**
     * Retrieve quests by tourist spot. Completion data comes from `user_task_log`.
     */
    async fetchQuestsByTouristSpotId(
        touristSpotId: string,
        userId?: string,
    ): Promise<QuestEntity[]> {
        const questsByCacheKey = `quests-by-tourist-spot:${touristSpotId}`;

        const fetchQuestsByTouristSpotDataFn = async (): Promise<QuestWithTasks[]> => {
            return this.prisma.quest.findMany({
                where: { tourist_spot_id: touristSpotId },
                include: { quest_task: true, tourist_spot: true },
                orderBy: { ins_date_time: 'desc' },
            });
        };

        const questsDb = await this.cachingService.getOrSet<QuestWithTasks[]>(
            questsByCacheKey,
            fetchQuestsByTouristSpotDataFn,
            CACHE_TTL_SECONDS,
        );

        if (!questsDb || questsDb.length === 0) return [];

        const userCompletedTasksBySpotCacheKey = `user-completed-tasks-by-spot:${userId}:${touristSpotId}`;

        const fetchUserCompletedTasksBySpotDataFn = async (
            userId: string,
        ): Promise<{ quest_id: string; task_id: string }[]> => {
            const logs = await this.prisma.user_task_log.findMany({
                select: { quest_id: true, task_id: true },
                where: {
                    user_id: userId,
                    quest_id: { in: questsDb.map((q) => q.quest_id) },
                    status: TaskStatus.COMPLETED,
                },
            });
            return logs.map((log: { quest_id: string; task_id: string }) => ({
                quest_id: log.quest_id,
                task_id: log.task_id,
            }));
        };

        const completedTasks = userId
            ? ((await this.cachingService.getOrSet<{ quest_id: string; task_id: string }[]>(
                  userCompletedTasksBySpotCacheKey,
                  () => fetchUserCompletedTasksBySpotDataFn(userId),
                  CACHE_TTL_SECONDS,
              )) ?? [])
            : [];

        // Group completed tasks by quest_id
        const completedTasksByQuest = completedTasks.reduce(
            (acc, { quest_id, task_id }) => {
                if (!acc[quest_id]) {
                    acc[quest_id] = [];
                }
                acc[quest_id].push(task_id);
                return acc;
            },
            {} as Record<string, string[]>,
        );

        return questsDb.map((quest) => {
            return QuestMapper.prismaModelToQuestEntityWithUserCompletedTasks(
                quest,
                completedTasksByQuest[quest.quest_id] ?? [],
            );
        });
    }

    async createQuest(quest: QuestEntity): Promise<QuestEntity> {
        const created = await this.prisma.quest.create({
            data: QuestMapper.questEntityToPrismaInput(quest),
            include: { quest_task: true, tourist_spot: true },
        });

        // Clear all quest-related cache entries
        await this.cachingService.clearAll();
        return QuestMapper.prismaModelToQuestEntity(created);
    }

    async createQuestTask(task: Task, questId: string): Promise<Task> {
        const created = await this.prisma.quest_task.create({
            data: {
                ...QuestMapper.taskToPrismaInput(task),
                quest: {
                    connect: {
                        quest_id: questId,
                    },
                },
            },
        });
        // Clear all quest-related cache entries
        await this.cachingService.clearAll();
        return QuestMapper.prismaTaskModelToTask(created);
    }

    async updateQuest(quest: QuestEntity): Promise<QuestEntity> {
        const updated = await this.prisma.quest.update({
            where: { quest_id: quest.questId },
            data: QuestMapper.questEntityToPrismaUpdateInput(quest),
            include: { quest_task: true, tourist_spot: true },
        });

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
        return QuestMapper.prismaTaskModelToTask(updated);
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

    async isQuestCompleted(questId: string, userId: string): Promise<boolean> {
        const [tasks, completedLogs] = await Promise.all([
            this.prisma.quest_task.findMany({
                where: { quest_id: questId },
                select: { quest_task_id: true },
            }),
            this.prisma.user_task_log.findMany({
                where: { quest_id: questId, user_id: userId, status: TaskStatus.COMPLETED },
                select: { task_id: true },
            }),
        ]);

        const completedSet = new Set(completedLogs.map((l) => l.task_id));
        return tasks.every((t) => completedSet.has(t.quest_task_id));
    }

    async getMostPopularQuest(): Promise<QuestEntity[]> {
        const topQuests = await this.prisma.user_task_log.groupBy({
            by: ['quest_id'],
            where: {
                status: TaskStatus.COMPLETED,
            },
            _count: {
                quest_id: true,
            },
            orderBy: {
                _count: {
                    quest_id: 'desc',
                },
            },
            take: 3,
        });

        if (topQuests.length === 0) {
            return [];
        }

        const popularQuestIds = topQuests.map((quest) => quest.quest_id);

        const questsDb = await this.prisma.quest.findMany({
            where: { quest_id: { in: popularQuestIds } },
            include: { quest_task: true, tourist_spot: true },
        });

        // Create a map to maintain the order based on popularity
        const questMap = new Map(questsDb.map((quest) => [quest.quest_id, quest]));

        const orderedQuests: QuestWithTasks[] = [];
        for (const questId of popularQuestIds) {
            const quest = questMap.get(questId);
            if (quest) {
                orderedQuests.push(quest);
            }
        }

        // Cache each quest individually
        const cachedQuests = await Promise.all(
            orderedQuests.map(async (quest) => {
                return await this.cachingService.getOrSet<QuestWithTasks | null>(
                    `quest:${quest.quest_id}`,
                    () => Promise.resolve(quest),
                    CACHE_TTL_SECONDS,
                );
            }),
        );

        return cachedQuests
            .filter((quest): quest is QuestWithTasks => quest !== null)
            .map((quest) => QuestMapper.prismaModelToQuestEntity(quest));
    }

    async findNearbyTouristSpots(
        latitude: number,
        longitude: number,
        radiusKm: number,
    ): Promise<
        Array<{
            touristSpotId: string;
            distance: number;
            questId?: string;
            taskId?: string;
        }>
    > {
        try {
            this.logger.log(
                `Searching for tourist spots near ${latitude}, ${longitude} within ${radiusKm}km`,
            );

            // Get all tourist spots and calculate distance
            const touristSpots = await this.prisma.tourist_spot.findMany({
                include: {
                    quest: {
                        include: {
                            quest_task: true,
                        },
                    },
                },
            });

            const results = [];

            for (const spot of touristSpots) {
                // Calculate distance using Haversine formula
                const distance = this.calculateDistance(
                    latitude,
                    longitude,
                    spot.latitude,
                    spot.longitude,
                );

                // Only include spots within the radius
                if (distance <= radiusKm) {
                    // Add each quest/task combination for this tourist spot
                    for (const quest of spot.quest) {
                        for (const task of quest.quest_task) {
                            results.push({
                                touristSpotId: spot.tourist_spot_id,
                                distance: distance,
                                questId: quest.quest_id,
                                taskId: task.quest_task_id,
                            });
                        }
                    }

                    // If no quests/tasks, still include the tourist spot
                    if (spot.quest.length === 0) {
                        results.push({
                            touristSpotId: spot.tourist_spot_id,
                            distance: distance,
                            questId: undefined,
                            taskId: undefined,
                        });
                    }
                }
            }

            // Sort by distance
            results.sort((a, b) => a.distance - b.distance);

            this.logger.log(
                `Found ${results.length} quest/task combinations within ${radiusKm}km radius`,
            );

            return results;
        } catch (error) {
            this.logger.error('Error finding nearby tourist spots', error);
            return [];
        }
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) *
                Math.cos(this.deg2rad(lat2)) *
                Math.sin(dLon / 2) *
                Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI / 180);
    }
}
