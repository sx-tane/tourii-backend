import { StoryStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const UserStoryLogResponseSchema = z.object({
    userStoryLogId: z.string().describe('Story log ID'),
    userId: z.string().describe('User ID'),
    storyChapterId: z.string().describe('Story chapter ID'),
    status: z.nativeEnum(StoryStatus).describe('Story status'),
    unlockedAt: z.date().optional().describe('Unlocked date'),
    finishedAt: z.date().optional().describe('Finished date'),
    ...MetadataFieldsSchema,
});

export class UserStoryLogResponseDto extends createZodDto(UserStoryLogResponseSchema) {}
