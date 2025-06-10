import { QuestEntity } from '@app/core/domain/game/quest/quest.entity';
import { Task } from '@app/core/domain/game/quest/task';
import { ContextStorage } from '@app/core/support/context/context-storage';
import type { QuestTaskUpdateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/update/quest-task-update-request.model';
import type { QuestUpdateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/update/quest-update-request.model';

export class QuestUpdateRequestBuilder {
    static dtoToQuest(dto: QuestUpdateRequestDto, base: QuestEntity): QuestEntity {
        return new QuestEntity(
            {
                questName: dto.questName,
                questDesc: dto.questDesc,
                questType: dto.questType,
                questImage: dto.questImage,
                isUnlocked: dto.isUnlocked,
                isPremium: dto.isPremium,
                totalMagatamaPointAwarded: dto.totalMagatamaPointAwarded,
                rewardType: dto.rewardType,
                delFlag: dto.delFlag,
                insUserId: base.insUserId,
                insDateTime: base.insDateTime,
                updUserId: dto.updUserId,
                updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                requestId: base.requestId,
                tasks: base.tasks,
                touristSpot: base.touristSpot,
            },
            dto.questId,
        );
    }

    static dtoToQuestTask(dto: QuestTaskUpdateRequestDto, base: Task): Task {
        return new Task({
            taskId: dto.taskId,
            questId: dto.questId,
            taskTheme: dto.taskTheme,
            taskType: dto.taskType,
            taskName: dto.taskName,
            taskDesc: dto.taskDesc,
            isUnlocked: dto.isUnlocked,
            requiredAction: dto.requiredAction,
            groupActivityMembers: dto.groupActivityMembers,
            selectOptions: dto.selectOptions,
            antiCheatRules: dto.antiCheatRules,
            magatamaPointAwarded: dto.magatamaPointAwarded,
            totalMagatamaPointAwarded: dto.totalMagatamaPointAwarded,
            delFlag: dto.delFlag,
            insUserId: base.insUserId,
            insDateTime: base.insDateTime,
            updUserId: dto.updUserId,
            updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
            requestId: base.requestId,
        });
    }
}
