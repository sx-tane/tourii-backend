import { z } from 'zod';

export const questTaskSocialShareRequestSchema = z.object({
    proofUrl: z.string().url().min(1, 'Proof URL is required'),
});

export type QuestTaskSocialShareRequestDto = z.infer<typeof questTaskSocialShareRequestSchema>;
