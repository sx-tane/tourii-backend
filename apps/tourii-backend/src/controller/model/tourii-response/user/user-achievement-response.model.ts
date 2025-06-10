import { AchievementType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const UserAchievementResponseSchema = z.object({
    userAchievementId: z.string().describe('Achievement ID'),
    userId: z.string().describe('User ID'),
    achievementName: z.string().describe('Achievement name'),
    achievementDesc: z.string().optional().describe('Achievement description'),
    iconUrl: z.string().optional().describe('Icon URL'),
    achievementType: z.nativeEnum(AchievementType).describe('Achievement type'),
    magatamaPointAwarded: z.number().describe('Magatama points awarded'),
    ...MetadataFieldsSchema,
});

export class UserAchievementResponseDto extends createZodDto(UserAchievementResponseSchema) {}
