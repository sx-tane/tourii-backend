import { QuestEntity } from '@app/core/domain/game/quest/quest.entity';
import { Task } from '@app/core/domain/game/quest/task';
import type { quest, quest_task, tourist_spot } from '@prisma/client';
import { ModelRouteMapper } from './model-route-mapper';

export class QuestMapper {
    static prismaModelToQuestEntity(
        prismaModel: quest & { quest_task?: quest_task[]; tourist_spot?: tourist_spot },
    ): QuestEntity {
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
                tasks:
                    prismaModel.quest_task?.map(
                        (task) =>
                            new Task({
                                taskId: task.quest_task_id,
                                questId: task.quest_id,
                                taskTheme: task.task_theme,
                                taskType: task.task_type,
                                taskName: task.task_name,
                                taskDesc: task.task_desc,
                                isUnlocked: task.is_unlocked,
                                requiredAction: task.required_action,
                                groupActivityMembers: task.group_activity_members as any[],
                                selectOptions: task.select_options as any[],
                                antiCheatRules: task.anti_cheat_rules as any,
                                magatamaPointAwarded: task.magatama_point_awarded,
                                totalMagatamaPointAwarded: task.total_magatama_point_awarded,
                                delFlag: task.del_flag,
                                insUserId: task.ins_user_id,
                                insDateTime: task.ins_date_time,
                                updUserId: task.upd_user_id,
                                updDateTime: task.upd_date_time,
                                requestId: task.request_id ?? undefined,
                            }),
                    ) ?? [],
                touristSpot: prismaModel.tourist_spot
                    ? ModelRouteMapper.prismaModelToTouristSpotEntity(prismaModel.tourist_spot)
                    : undefined,
            },
            prismaModel.quest_id,
        );
    }

    static prismaTaskModelToTaskEntity(prismaModel: quest_task): Task {
        return new Task({
            taskId: prismaModel.quest_task_id,
            questId: prismaModel.quest_id,
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
            totalMagatamaPointAwarded: prismaModel.total_magatama_point_awarded,
            delFlag: prismaModel.del_flag,
            insUserId: prismaModel.ins_user_id,
            insDateTime: prismaModel.ins_date_time,
            updUserId: prismaModel.upd_user_id,
            updDateTime: prismaModel.upd_date_time,
            requestId: prismaModel.request_id ?? undefined,
        });
    }
}
