import { TaskStatus } from '@prisma/client';

export interface GroupQuestMember {
    userId: string;
    username: string;
    role?: string | null;
}

export interface GroupQuestMembers {
    groupId: string;
    leaderUserId: string;
    members: GroupQuestMember[];
}

export interface GroupQuestRepository {
    getGroupMembers(questId: string): Promise<GroupQuestMembers>;

    /**
     * Updates task statuses for group quest members
     *
     * Only updates tasks that are currently in AVAILABLE status to preserve
     * individual task progress. COMPLETED and FAILED tasks retain their status.
     *
     * @param questId The quest ID
     * @param memberIds Array of user IDs to update
     * @param status The target status (typically ONGOING when starting a quest)
     */
    updateMembersStatus(questId: string, memberIds: string[], status: TaskStatus): Promise<void>;
}
