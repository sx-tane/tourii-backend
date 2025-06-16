import { StoryStatus } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StoryCompletionResponseSchema = z.object({
    success: z.boolean().describe('Whether the story completion was successful'),
    message: z.string().describe('Success or error message'),
    storyProgress: z.object({
        storyChapterId: z.string().describe('ID of the completed story chapter'),
        chapterTitle: z.string().describe('Title of the completed chapter'),
        status: z.nativeEnum(StoryStatus).describe('Current story status'),
        completedAt: z.date().nullable().describe('Timestamp when the story was completed'),
    }).describe('Story progress information'),
    unlockedQuests: z.array(z.object({
        questId: z.string().describe('ID of the unlocked quest'),
        questName: z.string().describe('Name of the unlocked quest'),
        questDesc: z.string().describe('Description of the unlocked quest'),
        questImage: z.string().nullable().describe('Image URL for the quest'),
        touristSpotName: z.string().describe('Name of the tourist spot where the quest is located'),
        totalMagatamaPointAwarded: z.number().describe('Total magatama points awarded for completing this quest'),
        isPremium: z.boolean().describe('Whether this is a premium quest'),
    })).describe('List of quests unlocked by completing this story'),
    rewards: z.object({
        magatamaPointsEarned: z.number().describe('Total magatama points earned from story completion and achievements'),
        achievementsUnlocked: z.array(z.string()).describe('List of achievement names unlocked'),
    }).describe('Rewards earned from story completion'),
});

export class StoryCompletionResponseDto extends createZodDto(StoryCompletionResponseSchema) {}