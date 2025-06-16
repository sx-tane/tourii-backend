import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const StoryReadingStartRequestSchema = z.object({
    userId: z.string().describe('ID of the user starting to read the story chapter'),
});

export class StoryReadingStartRequestDto extends createZodDto(StoryReadingStartRequestSchema) {}