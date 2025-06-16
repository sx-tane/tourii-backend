import { z } from 'zod';

/**
 * Request model for consolidated story action endpoint
 * Supports start, complete, and progress actions based on X-Story-Action header
 */
export const StoryActionRequestSchema = z.object({
    /** ID of the user performing the action */
    userId: z.string().describe('ID of the user performing the story action'),
});

export type StoryActionRequestDto = z.infer<typeof StoryActionRequestSchema>;