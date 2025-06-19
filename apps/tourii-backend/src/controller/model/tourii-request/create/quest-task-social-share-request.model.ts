import { z } from 'zod';

export const questTaskSocialShareRequestSchema = z.object({
    proofUrl: z.string().url().min(1, 'Proof URL is required'),
    latitude: z.number().optional().describe('Optional latitude for location tracking'),
    longitude: z.number().optional().describe('Optional longitude for location tracking'),
});

export type QuestTaskSocialShareRequestDto = z.infer<typeof questTaskSocialShareRequestSchema>;
