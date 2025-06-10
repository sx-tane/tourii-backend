import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const UserInviteLogResponseSchema = z.object({
    inviteLogId: z.string().describe('Invite log ID'),
    userId: z.string().describe('User ID'),
    inviteeDiscordId: z.string().optional().describe('Invitee Discord ID'),
    inviteeUserId: z.string().optional().describe('Invitee user ID'),
    magatamaPointAwarded: z.number().describe('Magatama points awarded'),
    ...MetadataFieldsSchema,
});

export class UserInviteLogResponseDto extends createZodDto(UserInviteLogResponseSchema) {}
