import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const GroupMemberSchema = z.object({
    userId: z.string().describe('User ID of the member'),
    username: z.string().describe('Username of the member'),
});

export const GroupMembersResponseSchema = z.object({
    groupId: z.string().describe('Unique identifier for the group'),
    leaderUserId: z.string().describe('User ID of the group leader'),
    members: z.array(GroupMemberSchema).describe('List of group members'),
});

export class GroupMembersResponseDto extends createZodDto(GroupMembersResponseSchema) {}
