import { QuestEntity, QuestWithTasks } from '@app/core/domain/game/quest/quest.entity';
import { Task } from '@app/core/domain/game/quest/task';
import type { Prisma, quest_task } from '@prisma/client';
import { InputJsonValue } from '@prisma/client/runtime/library';
import { ModelRouteMapper } from './model-route-mapper';

export class QuestMapper {
    static prismaModelToQuestEntity(prismaModel: QuestWithTasks): QuestEntity {
        return new QuestEntity(
            {
                questName: prismaModel.quest_name,
                questDesc: prismaModel.quest_desc,
                questType: prismaModel.quest_type,
                questImage: prismaModel.quest_image ?? undefined,
                isUnlocked: prismaModel.is_unlocked,
                isPremium: prismaModel.is_premium,
                totalMagatamaPointAwarded: prismaModel.total_magatama_point_awarded ?? 0,
                rewardType: prismaModel.reward_type,
                delFlag: prismaModel.del_flag ?? false,
                insUserId: prismaModel.ins_user_id,
                insDateTime: prismaModel.ins_date_time,
                updUserId: prismaModel.upd_user_id,
                updDateTime: prismaModel.upd_date_time,
                requestId: prismaModel.request_id ?? undefined,
                tasks: prismaModel.quest_task?.map((task) =>
                    QuestMapper.prismaTaskModelToTask(task),
                ),
                touristSpot: prismaModel.tourist_spot
                    ? ModelRouteMapper.prismaModelToTouristSpotEntity(prismaModel.tourist_spot)
                    : undefined,
            },
            prismaModel.quest_id,
        );
    }

    static prismaModelToQuestEntityWithUserCompletedTasks(
        prismaModel: QuestWithTasks,
        completedTasks: string[],
    ): QuestEntity {
        const completedTaskIdSet = new Set(completedTasks);
        return new QuestEntity(
            {
                questName: prismaModel.quest_name,
                questDesc: prismaModel.quest_desc,
                questType: prismaModel.quest_type,
                questImage: prismaModel.quest_image ?? undefined,
                isUnlocked: prismaModel.is_unlocked,
                isPremium: prismaModel.is_premium,
                totalMagatamaPointAwarded: prismaModel.total_magatama_point_awarded ?? 0,
                rewardType: prismaModel.reward_type,
                delFlag: prismaModel.del_flag ?? false,
                insUserId: prismaModel.ins_user_id,
                insDateTime: prismaModel.ins_date_time,
                updUserId: prismaModel.upd_user_id,
                updDateTime: prismaModel.upd_date_time,
                requestId: prismaModel.request_id ?? undefined,
                tasks: prismaModel.quest_task?.map((task) =>
                    QuestMapper.prismaTaskModelToTask(
                        task,
                        completedTaskIdSet.has(task.quest_task_id),
                    ),
                ),
                touristSpot: prismaModel.tourist_spot
                    ? ModelRouteMapper.prismaModelToTouristSpotEntity(prismaModel.tourist_spot)
                    : undefined,
                completedTasks: completedTasks,
            },
            prismaModel.quest_id,
        );
    }

    static prismaTaskModelToTask(prismaModel: quest_task, isCompleted = false): Task {
        return new Task({
            taskId: prismaModel.quest_task_id,
            taskTheme: prismaModel.task_theme,
            taskType: prismaModel.task_type,
            taskName: prismaModel.task_name,
            taskDesc: prismaModel.task_desc,
            isUnlocked: prismaModel.is_unlocked,
            requiredAction: prismaModel.required_action,
            groupActivityMembers: prismaModel.group_activity_members as any[],
            selectOptions: prismaModel.select_options as any[],
            antiCheatRules: prismaModel.anti_cheat_rules as any,
            magatamaPointAwarded: prismaModel.magatama_point_awarded,
            rewardEarned: prismaModel.reward_earned ?? undefined,
            delFlag: prismaModel.del_flag,
            insUserId: prismaModel.ins_user_id,
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: prismaModel.request_id ?? undefined,
            isCompleted,
        });
    }

    static questEntityToPrismaInput(questEntity: QuestEntity): Prisma.questUncheckedCreateInput {
        return {
            tourist_spot_id: questEntity.touristSpot?.touristSpotId ?? '',
            quest_name: questEntity.questName ?? '',
            quest_desc: questEntity.questDesc ?? '',
            quest_image: questEntity.questImage,
            quest_type: questEntity.questType,
            is_unlocked: questEntity.isUnlocked,
            is_premium: questEntity.isPremium,
            total_magatama_point_awarded: questEntity.totalMagatamaPointAwarded ?? 0,
            reward_type: questEntity.rewardType,
            del_flag: questEntity.delFlag,
            ins_user_id: questEntity.insUserId,
            ins_date_time: questEntity.insDateTime,
            upd_user_id: questEntity.updUserId,
            upd_date_time: questEntity.updDateTime,
            request_id: questEntity.requestId,
            quest_task: {
                create: questEntity.tasks?.map((task) => QuestMapper.taskToPrismaInput(task)),
            },
        };
    }

    static taskToPrismaInput(task: Task): Prisma.quest_taskUncheckedCreateWithoutQuestInput {
        return {
            task_theme: task.taskTheme,
            task_type: task.taskType,
            task_name: task.taskName,
            task_desc: task.taskDesc,
            is_unlocked: task.isUnlocked,
            required_action: task.requiredAction,
            group_activity_members: task.groupActivityMembers,
            select_options: task.selectOptions,
            anti_cheat_rules: task.antiCheatRules as InputJsonValue,
            magatama_point_awarded: task.magatamaPointAwarded,
            reward_earned: task.rewardEarned,
            del_flag: task.delFlag,
            ins_user_id: task.insUserId,
            ins_date_time: task.insDateTime,
            upd_user_id: task.updUserId,
            upd_date_time: task.updDateTime,
            request_id: task.requestId ?? null,
        };
    }

    static questEntityToPrismaUpdateInput(
        questEntity: QuestEntity,
    ): Prisma.questUncheckedUpdateInput {
        return {
            tourist_spot_id: questEntity.touristSpot?.touristSpotId,
            quest_name: questEntity.questName,
            quest_desc: questEntity.questDesc,
            quest_image: questEntity.questImage,
            quest_type: questEntity.questType,
            is_unlocked: questEntity.isUnlocked,
            is_premium: questEntity.isPremium,
            total_magatama_point_awarded: questEntity.totalMagatamaPointAwarded,
            reward_type: questEntity.rewardType,
            del_flag: questEntity.delFlag,
            upd_user_id: questEntity.updUserId,
            upd_date_time: questEntity.updDateTime,
        };
    }

    static taskEntityToPrismaUpdateInput(task: Task): Prisma.quest_taskUncheckedUpdateInput {
        return {
            quest_task_id: task.taskId,
            task_theme: task.taskTheme,
            task_type: task.taskType,
            task_name: task.taskName,
            task_desc: task.taskDesc,
            is_unlocked: task.isUnlocked,
            required_action: task.requiredAction,
            group_activity_members: task.groupActivityMembers,
            select_options: task.selectOptions,
            anti_cheat_rules: task.antiCheatRules as InputJsonValue,
            magatama_point_awarded: task.magatamaPointAwarded,
            reward_earned: task.rewardEarned,
            del_flag: task.delFlag,
            upd_user_id: task.updUserId,
            upd_date_time: task.updDateTime,
        };
    }
}
