import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const DiscordUserRolesResponseSchema = z.object({
    discordUserRolesId: z.string().describe('Discord user roles ID'),
    userId: z.string().describe('User ID'),
    roleId: z.string().describe('Role ID'),
    ...MetadataFieldsSchema,
});

export class DiscordUserRolesResponseDto extends createZodDto(DiscordUserRolesResponseSchema) {}
