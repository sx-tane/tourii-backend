import { QuestEntity, QuestEntityWithPagination } from '@app/core/domain/game/quest/quest.entity';
import type { QuestListResponseDto } from '@app/tourii-backend/controller/model/tourii-response/quest-list-response.model';
import { QuestResponseDto } from '@app/tourii-backend/controller/model/tourii-response/quest-response.model';
import { QuestType } from '@prisma/client';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
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
            quest: {
                questId: quest.questId ?? '',
                questName: quest.questName ?? '',
                questDesc: quest.questDesc ?? '',
                questImage: quest.questImage ?? '',
                questType: quest.questType ?? QuestType.UNKNOWN,
                isUnlocked: quest.isUnlocked ?? false,
                isPremium: quest.isPremium ?? false,
                totalMagatamaPointAwarded: quest.totalMagatamaPointAwarded ?? 0,
            },
        };
    }
}
