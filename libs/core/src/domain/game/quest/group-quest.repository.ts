import { QuestStatus } from '@prisma/client';

export interface GroupQuestMember {
    user_id: string;
    username: string;
    role?: string | null;
}

export interface GroupQuestMembers {
    group_id: string;
    leader_user_id: string;
    members: GroupQuestMember[];
}

export interface GroupQuestRepository {
    getGroupMembers(questId: string): Promise<GroupQuestMembers>;
    updateMembersStatus(questId: string, memberIds: string[], status: QuestStatus): Promise<void>;
}
