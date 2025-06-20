import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const SubmitAnswerTextTaskRequestSchema = z.object({
    taskId: z.string().describe('ID of the task'),
    answer: z.string().describe('Answer to the task'),
    userId: z.string().describe('ID of the user'),
});

export class SubmitAnswerTextRequestTaskDto extends createZodDto(
    SubmitAnswerTextTaskRequestSchema,
) {}

export const SubmitSelectOptionTaskRequestSchema = z.object({
    taskId: z.string().describe('ID of the task'),
    selectedOptionIds: z.array(z.number()).describe('IDs of the selected options'),
    userId: z.string().describe('ID of the user'),
});

export class SubmitSelectOptionsTaskRequestDto extends createZodDto(
    SubmitSelectOptionTaskRequestSchema,
) {}

export const SubmitCheckInTaskRequestSchema = z.object({
    taskId: z.string().describe('ID of the task'),
    longitude: z.number().describe('Longitude of the user'),
    latitude: z.number().describe('Latitude of the user'),
    userId: z.string().describe('ID of the user'),
});

export class SubmitCheckInTaskRequestDto extends createZodDto(SubmitCheckInTaskRequestSchema) {}
