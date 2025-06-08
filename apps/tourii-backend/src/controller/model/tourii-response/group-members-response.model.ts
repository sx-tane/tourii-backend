import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const GroupMemberSchema = z.object({
    user_id: z.string().describe('User ID of the member'),
    username: z.string().describe('Username of the member'),
});

export const GroupMembersResponseSchema = z.object({
    group_id: z.string().describe('Unique identifier for the group'),
    leader_user_id: z.string().describe('User ID of the group leader'),
    members: z.array(GroupMemberSchema).describe('List of group members'),
});

export class GroupMembersResponseDto extends createZodDto(GroupMembersResponseSchema) {}
