import {
    GroupQuestRepository,
    GroupQuestMembers,
    GroupQuestMember,
} from '@app/core/domain/game/quest/group-quest.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable } from '@nestjs/common';
import { QuestStatus } from '@prisma/client';

@Injectable()
export class GroupQuestRepositoryDb implements GroupQuestRepository {
    constructor(private readonly prisma: PrismaService) {}

    async getGroupMembers(questId: string): Promise<GroupQuestMembers> {
        const log = await this.prisma.user_quest_log.findFirst({
            where: { quest_id: questId },
            select: { group_activity_members: true },
        });
        if (!log) {
            return { groupId: questId, leaderUserId: '', members: [] };
        }

        const membersData = log.group_activity_members as Array<{
            user_id: string;
            role?: string | null;
        }>;
        const memberIds = membersData.map((m) => m.user_id);
        const users = await this.prisma.user.findMany({
            where: { user_id: { in: memberIds } },
            select: { user_id: true, username: true },
        });
        const members: GroupQuestMember[] = memberIds.map((id) => {
            const user = users.find((u) => u.user_id === id);
            const member = membersData.find((m) => m.user_id === id);
            return {
                userId: id,
                username: user?.username ?? '',
                role: member?.role ?? null,
            };
        });
        const leader = membersData.find((m) => m.role === 'leader');
        return {
            groupId: questId,
            leaderUserId: leader?.user_id ?? memberIds[0] ?? '',
            members,
        };
    }

    async updateMembersStatus(
        questId: string,
        memberIds: string[],
        status: QuestStatus,
    ): Promise<void> {
        if (memberIds.length === 0) return;
        await this.prisma.user_quest_log.updateMany({
            where: { quest_id: questId, user_id: { in: memberIds } },
            data: { status },
        });
    }
}
