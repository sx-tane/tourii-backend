import { TouristSpot } from '@app/core/domain/game/model-route/tourist-spot';
import { QuestEntity, QuestEntityWithPagination } from '@app/core/domain/game/quest/quest.entity';
import { Task } from '@app/core/domain/game/quest/task';
import { TransformDate } from '@app/core/support/transformer/date-transformer';
import type { QuestListResponseDto } from '@app/tourii-backend/controller/model/tourii-response/quest-list-response.model';
import {
    QuestResponseDto,
    TaskResponseDto,
} from '@app/tourii-backend/controller/model/tourii-response/quest-response.model';
import { TouristSpotResponseDto } from '@app/tourii-backend/controller/model/tourii-response/tourist-spot-response.model';
import { QuestType } from '@prisma/client';

export class QuestResultBuilder {
    static questWithPaginationToDto(
        questWithPagination: QuestEntityWithPagination,
    ): QuestListResponseDto {
        const quest = questWithPagination.quests;
        const pagination = questWithPagination.pagination;
        return {
            quests: quest.map((quest) => ({
                questId: quest.questId ?? '',
                questName: quest.questName ?? '',
                questDesc: quest.questDesc ?? '',
                questImage: quest.questImage ?? '',
                questType: quest.questType ?? QuestType.UNKNOWN,
                isUnlocked: quest.isUnlocked ?? false,
                isPremium: quest.isPremium ?? false,
                totalMagatamaPointAwarded: quest.totalMagatamaPointAwarded ?? 0,
                tasks: quest.tasks?.map((task) => QuestResultBuilder.taskToDto(task)),
                delFlag: quest.delFlag ?? false,
                insUserId: quest.insUserId ?? '',
                insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(quest.insDateTime) ?? '',
                updUserId: quest.updUserId,
                updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(quest.updDateTime) ?? '',
                touristSpot: quest.touristSpot
                    ? QuestResultBuilder.touristSpotToDto(quest.touristSpot)
                    : undefined,
            })),
            pagination: {
                currentPage: pagination.currentPage,
                totalPages: pagination.totalPages,
                totalQuests: pagination.totalQuests,
            },
        };
    }

    static questToDto(quest: QuestEntity): QuestResponseDto {
        return {
            questId: quest.questId ?? '',
            questName: quest.questName ?? '',
            questDesc: quest.questDesc ?? '',
            questImage: quest.questImage ?? '',
            questType: quest.questType ?? QuestType.UNKNOWN,
            isUnlocked: quest.isUnlocked ?? false,
            isPremium: quest.isPremium ?? false,
            totalMagatamaPointAwarded: quest.totalMagatamaPointAwarded ?? 0,
            tasks: quest.tasks?.map((task) => QuestResultBuilder.taskToDto(task)),
            touristSpot: quest.touristSpot
                ? QuestResultBuilder.touristSpotToDto(quest.touristSpot)
                : undefined,
            delFlag: quest.delFlag ?? false,
            insUserId: quest.insUserId ?? '',
            insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(quest.insDateTime) ?? '',
            updUserId: quest.updUserId,
            updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(quest.updDateTime) ?? '',
        };
    }

    static taskToDto(task: Task): TaskResponseDto {
        return {
            taskId: task.taskId ?? '',
            questId: task.questId,
            taskTheme: task.taskTheme,
            taskType: task.taskType,
            taskName: task.taskName,
            taskDesc: task.taskDesc,
            isUnlocked: task.isUnlocked,
            requiredAction: task.requiredAction,
            groupActivityMembers: task.groupActivityMembers,
            selectOptions: task.selectOptions,
            antiCheatRules: task.antiCheatRules,
            magatamaPointAwarded: task.magatamaPointAwarded,
            totalMagatamaPointAwarded: task.totalMagatamaPointAwarded,
            delFlag: task.delFlag ?? false,
            insUserId: task.insUserId ?? '',
            insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(task.insDateTime) ?? '',
            updUserId: task.updUserId,
            updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(task.updDateTime) ?? '',
        };
    }

    static touristSpotToDto(touristSpot: TouristSpot): TouristSpotResponseDto {
        return {
            touristSpotId: touristSpot.touristSpotId ?? '',
            storyChapterId: touristSpot.storyChapterId ?? '',
            touristSpotName: touristSpot.touristSpotName ?? '',
            touristSpotDesc: touristSpot.touristSpotDesc ?? '',
            touristSpotLatitude: touristSpot.latitude ?? 0,
            touristSpotLongitude: touristSpot.longitude ?? 0,
            bestVisitTime: touristSpot.bestVisitTime ?? '',
            address: touristSpot.address ?? '',
            storyChapterLink: touristSpot.storyChapterLink ?? '',
            touristSpotHashtag: touristSpot.touristSpotHashtag ?? [],
            imageSet: touristSpot.imageSet ?? { main: '', small: [] },
            weatherInfo: undefined,
            delFlag: touristSpot.delFlag ?? false,
            insUserId: touristSpot.insUserId ?? '',
            insDateTime: TransformDate.transformDateToYYYYMMDDHHmm(touristSpot.insDateTime) ?? '',
            updUserId: touristSpot.updUserId,
            updDateTime: TransformDate.transformDateToYYYYMMDDHHmm(touristSpot.updDateTime) ?? '',
        };
    }
}
