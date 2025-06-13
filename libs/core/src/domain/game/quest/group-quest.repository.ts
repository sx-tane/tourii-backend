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
    updateMembersStatus(questId: string, memberIds: string[], status: TaskStatus): Promise<void>;
}
