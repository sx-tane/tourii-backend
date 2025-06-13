import {
    GroupQuestMember,
    GroupQuestMembers,
    GroupQuestRepository,
} from '@app/core/domain/game/quest/group-quest.repository';
import { PrismaService } from '@app/core/provider/prisma.service';
import { Injectable, Logger } from '@nestjs/common';
import { TaskStatus } from '@prisma/client';

@Injectable()
export class GroupQuestRepositoryDb implements GroupQuestRepository {
    private readonly logger = new Logger(GroupQuestRepositoryDb.name);

    constructor(private readonly prisma: PrismaService) {}

    async getGroupMembers(questId: string): Promise<GroupQuestMembers> {
        const log = await this.prisma.user_task_log.findFirst({
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

    /**
     * Updates member task statuses for a group quest
     *
     * @param questId The quest ID
     * @param memberIds Array of user IDs to update
     * @param status The target status to set
     *
     * Note: This method only updates tasks that are currently AVAILABLE
     * to preserve individual task progress (COMPLETED/FAILED tasks remain unchanged)
     */
    async updateMembersStatus(
        questId: string,
        memberIds: string[],
        status: TaskStatus,
    ): Promise<void> {
        if (memberIds.length === 0) return;

        // Only update tasks that are currently AVAILABLE to preserve individual task progress
        // This prevents overwriting COMPLETED or FAILED task statuses when starting a group quest
        const result = await this.prisma.user_task_log.updateMany({
            where: {
                quest_id: questId,
                user_id: { in: memberIds },
                status: TaskStatus.AVAILABLE, // Only update available tasks to preserve progress
            },
            data: { status },
        });

        this.logger.debug(
            `Updated ${result.count} task logs for quest ${questId} from AVAILABLE to ${status} for ${memberIds.length} members`,
        );
    }
}
