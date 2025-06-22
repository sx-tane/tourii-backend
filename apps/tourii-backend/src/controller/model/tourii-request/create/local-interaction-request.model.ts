import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LocalInteractionSubmissionSchema = z.object({
    interactionType: z.enum(['text', 'photo', 'audio']).describe('Type of interaction content'),
    content: z.string().describe('Text content or base64 encoded file'),
    latitude: z.number().optional().describe('Optional latitude for anti-cheat verification'),
    longitude: z.number().optional().describe('Optional longitude for anti-cheat verification'),
});

export class LocalInteractionSubmissionDto extends createZodDto(LocalInteractionSubmissionSchema) {}
