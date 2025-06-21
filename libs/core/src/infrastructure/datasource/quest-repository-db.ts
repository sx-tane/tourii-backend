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

        const popularQuestIds = topQuests.map(quest => quest.quest_id);

        const questsDb = await this.prisma.quest.findMany({
            where: { quest_id: { in: popularQuestIds } },
            include: { quest_task: true, tourist_spot: true },
        });

        // Create a map to maintain the order based on popularity
        const questMap = new Map(questsDb.map(quest => [quest.quest_id, quest]));
        
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
            })
        );

        return cachedQuests
            .filter((quest): quest is QuestWithTasks => quest !== null)
            .map(quest => QuestMapper.prismaModelToQuestEntity(quest));
    }

    async findNearbyTouristSpots(
        latitude: number,
        longitude: number,
        radiusKm: number,
    ): Promise<Array<{
        touristSpotId: string;
        distance: number;
        questId?: string;
        taskId?: string;
    }>> {
        try {
            this.logger.log(
                `Searching for tourist spots near ${latitude}, ${longitude} within ${radiusKm}km`,
            );

            // Use Haversine formula to calculate distance in SQL
            // The formula: 6371 * acos(cos(radians(lat1)) * cos(radians(lat2)) * cos(radians(lng2) - radians(lng1)) + sin(radians(lat1)) * sin(radians(lat2)))
            const nearbySpots = await this.prisma.$queryRaw<Array<{
                tourist_spot_id: string;
                quest_id: string | null;
                task_id: string | null;
                distance: number;
                tourist_spot_name: string;
                latitude: number;
                longitude: number;
            }>>`
                WITH nearby_spots AS (
                    SELECT 
                        ts.tourist_spot_id,
                        ts.tourist_spot_name,
                        ts.latitude,
                        ts.longitude,
                        (6371 * acos(
                            cos(radians(${latitude})) * 
                            cos(radians(ts.latitude)) * 
                            cos(radians(ts.longitude) - radians(${longitude})) + 
                            sin(radians(${latitude})) * 
                            sin(radians(ts.latitude))
                        )) AS distance
                    FROM tourist_spot ts
                    WHERE (6371 * acos(
                        cos(radians(${latitude})) * 
                        cos(radians(ts.latitude)) * 
                        cos(radians(ts.longitude) - radians(${longitude})) + 
                        sin(radians(${latitude})) * 
                        sin(radians(ts.latitude))
                    )) <= ${radiusKm}
                )
                SELECT 
                    ns.tourist_spot_id,
                    ns.distance,
                    ns.tourist_spot_name,
                    ns.latitude,
                    ns.longitude,
                    q.quest_id,
                    qt.quest_task_id as task_id
                FROM nearby_spots ns
                LEFT JOIN quest q ON q.tourist_spot_id = ns.tourist_spot_id
                LEFT JOIN quest_task qt ON qt.quest_id = q.quest_id
                ORDER BY ns.distance ASC
            `;

            this.logger.log(
                `Found ${nearbySpots.length} tourist spots/tasks within ${radiusKm}km radius`,
            );

            // Group by tourist spot to avoid duplicates and get the closest quest/task for each spot
            const spotMap = new Map<string, {
                touristSpotId: string;
                distance: number;
                questId?: string;
                taskId?: string;
            }>();

            for (const spot of nearbySpots) {
                const key = spot.tourist_spot_id;
                if (!spotMap.has(key) || spotMap.get(key)!.distance > spot.distance) {
                    spotMap.set(key, {
                        touristSpotId: spot.tourist_spot_id,
                        distance: spot.distance,
                        questId: spot.quest_id || undefined,
                        taskId: spot.task_id || undefined,
                    });
                }
            }

            const result = Array.from(spotMap.values()).sort((a, b) => a.distance - b.distance);

            this.logger.log(
                `Returning ${result.length} unique tourist spots with distances: ${result.map(r => `${r.touristSpotId}(${r.distance.toFixed(3)}km)`).join(', ')}`,
            );

            return result;
        } catch (error) {
            this.logger.error('Error finding nearby tourist spots', error);
            return [];
        }
    }
}
