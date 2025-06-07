import { QuestEntity, QuestEntityWithPagination } from '@app/core/domain/game/quest/quest.entity';
import { Task } from '@app/core/domain/game/quest/task';
import { QuestRepository } from '@app/core/domain/game/quest/quest.repository';
import { CachingService } from '@app/core/provider/caching.service';
import { PrismaService } from '@app/core/provider/prisma.service';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma, QuestType, RewardType, TaskTheme, TaskType, quest, quest_task, tourist_spot } from '@prisma/client';
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

    async updateQuest(data: {
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
    }): Promise<QuestEntity> {
        const updated = (await this.prisma.quest.update({
            where: { quest_id: data.questId },
            data: {
                tourist_spot_id: data.touristSpotId,
                quest_name: data.questName,
                quest_desc: data.questDesc,
                quest_image: data.questImage ?? null,
                quest_type: data.questType,
                is_unlocked: data.isUnlocked,
                is_premium: data.isPremium,
                total_magatama_point_awarded: data.totalMagatamaPointAwarded,
                reward_type: data.rewardType,
                del_flag: data.delFlag,
                upd_user_id: data.updUserId,
                upd_date_time: new Date(),
            },
            include: { quest_task: true, tourist_spot: true },
        })) as QuestWithTasks;

        await this.cachingService.invalidate(/^quests:/);
        return QuestMapper.prismaModelToQuestEntity(updated);
    }

    async updateQuestTask(data: {
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
    }): Promise<Task> {
        const updated = await this.prisma.quest_task.update({
            where: { quest_task_id: data.taskId },
            data: {
                quest_id: data.questId,
                task_theme: data.taskTheme,
                task_type: data.taskType,
                task_name: data.taskName,
                task_desc: data.taskDesc,
                is_unlocked: data.isUnlocked,
                required_action: data.requiredAction,
                group_activity_members: data.groupActivityMembers ?? [],
                select_options: data.selectOptions ?? [],
                anti_cheat_rules: data.antiCheatRules,
                magatama_point_awarded: data.magatamaPointAwarded,
                total_magatama_point_awarded: data.totalMagatamaPointAwarded,
                del_flag: data.delFlag,
                upd_user_id: data.updUserId,
                upd_date_time: new Date(),
            },
        });

        return QuestMapper.prismaTaskModelToTaskEntity(updated);
    }
}
