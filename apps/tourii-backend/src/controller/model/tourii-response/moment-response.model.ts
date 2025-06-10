import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const MomentResponseSchema = z
    .object({
        imageUrl: z.string().nullable().optional().describe('URL of the moment image'),
        username: z.string().nullable().optional().describe('Traveler display name'),
        description: z.string().nullable().optional().describe('Short moment description'),
        rewardText: z.string().nullable().optional().describe('Text describing earned rewards'),
        insDateTime: z.date().describe('Timestamp when the moment occurred'),
    })
    .describe('Traveler moment information');

export const MomentListResponseSchema = z.object({
    moments: z.array(MomentResponseSchema),
});

export class MomentResponseDto extends createZodDto(MomentResponseSchema) {}
export class MomentListResponseDto extends createZodDto(MomentListResponseSchema) {}
