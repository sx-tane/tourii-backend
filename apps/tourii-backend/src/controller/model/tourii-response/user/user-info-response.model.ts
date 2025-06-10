import { LevelType, PassportType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const UserInfoResponseSchema = z.object({
    userId: z.string().describe('User ID'),
    digitalPassportAddress: z.string().describe('Digital passport NFT address'),
    logNftAddress: z.string().describe('Log NFT address'),
    userDigitalPassportType: z
        .nativeEnum(PassportType)
        .optional()
        .describe('Digital passport type'),
    level: z.nativeEnum(LevelType).optional().describe('User level'),
    discountRate: z.number().optional().describe('User discount rate'),
    magatamaPoints: z.number().describe('Magatama points balance'),
    magatamaBags: z.number().optional().describe('Magatama bags count'),
    totalQuestCompleted: z.number().describe('Total quests completed'),
    totalTravelDistance: z.number().describe('Total travel distance'),
    isPremium: z.boolean().describe('Premium status'),
    prayerBead: z.number().optional().describe('Prayer bead count'),
    sword: z.number().optional().describe('Sword count'),
    orgeMask: z.number().optional().describe('Orge mask count'),
    ...MetadataFieldsSchema,
});

export class UserInfoResponseDto extends createZodDto(UserInfoResponseSchema) {}
