import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StoryReadingCompleteRequestSchema = z.object({
    userId: z.string().describe('ID of the user completing the story chapter'),
});

export class StoryReadingCompleteRequestDto extends createZodDto(
    StoryReadingCompleteRequestSchema,
) {}
