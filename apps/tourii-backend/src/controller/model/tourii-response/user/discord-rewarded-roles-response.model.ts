import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const DiscordRewardedRolesResponseSchema = z.object({
    discordRewardedRolesId: z.string().describe('Discord rewarded roles ID'),
    userId: z.string().describe('User ID'),
    roleId: z.string().describe('Role ID'),
    magatamaPointAwarded: z.number().describe('Magatama points awarded'),
    ...MetadataFieldsSchema,
});

export class DiscordRewardedRolesResponseDto extends createZodDto(
    DiscordRewardedRolesResponseSchema,
) {}
