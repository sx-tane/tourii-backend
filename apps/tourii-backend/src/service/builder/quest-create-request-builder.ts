import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { QuestEntity } from '@app/core/domain/game/quest/quest.entity';
import { Task } from '@app/core/domain/game/quest/task';
import { ContextStorage } from '@app/core/support/context/context-storage';
import type { QuestCreateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/create/quest-create-request.model';
import type { QuestTaskCreateRequestDto } from '@app/tourii-backend/controller/model/tourii-request/create/quest-task-create-request.model';

export class QuestCreateRequestBuilder {
    static dtoToQuest(dto: QuestCreateRequestDto, insUserId: string): QuestEntity {
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
                insUserId: insUserId,
                insDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                updUserId: insUserId,
                updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                requestId: ContextStorage.getStore()?.getRequestId()?.value,
                touristSpot: new TouristSpot({
                    touristSpotId: dto.touristSpotId,
                    updUserId: insUserId,
                    updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
                }),
                tasks: [],
            },
            undefined,
        );
    }

    static dtoToQuestTask(dto: QuestTaskCreateRequestDto, insUserId: string): Task {
        return new Task({
            taskId: '',
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
            insUserId: insUserId,
            insDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
            updUserId: insUserId,
            updDateTime: ContextStorage.getStore()?.getSystemDateTimeJST() ?? new Date(),
            requestId: ContextStorage.getStore()?.getRequestId()?.value,
        });
    }
}
