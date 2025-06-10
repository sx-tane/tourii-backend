import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const DiscordActivityLogResponseSchema = z.object({
    discordActivityLogId: z.string().describe('Discord activity log ID'),
    userId: z.string().describe('User ID'),
    activityType: z.string().describe('Activity type'),
    activityDetails: z.string().optional().describe('Activity details'),
    magatamaPointAwarded: z.number().describe('Magatama points awarded'),
    ...MetadataFieldsSchema,
});

export class DiscordActivityLogResponseDto extends createZodDto(DiscordActivityLogResponseSchema) {}
