import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SubmitAnswerTextTaskRequestSchema = z.object({
    answer: z.string().describe('Answer to the task'),
});

export class SubmitAnswerTextRequestTaskDto extends createZodDto(
    SubmitAnswerTextTaskRequestSchema,
) {}

export const SubmitSelectOptionTaskRequestSchema = z.object({
    selectedOptionIds: z.array(z.number()).describe('IDs of the selected options'),
});

export class SubmitSelectOptionsTaskRequestDto extends createZodDto(
    SubmitSelectOptionTaskRequestSchema,
) {}

export const SubmitCheckInTaskRequestSchema = z.object({
    longitude: z.number().describe('Longitude of the user'),
    latitude: z.number().describe('Latitude of the user'),
});

export class SubmitCheckInTaskRequestDto extends createZodDto(SubmitCheckInTaskRequestSchema) {}
