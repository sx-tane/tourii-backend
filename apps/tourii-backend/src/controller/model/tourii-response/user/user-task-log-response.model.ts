import { TaskStatus, TaskType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const UserTaskLogResponseSchema = z.object({
    userTaskLogId: z.string().describe('Task log ID'),
    userId: z.string().describe('User ID'),
    questId: z.string().describe('Quest ID'),
    taskId: z.string().describe('Task ID'),
    status: z.nativeEnum(TaskStatus).describe('Task status'),
    action: z.nativeEnum(TaskType).describe('Task action type'),
    userResponse: z.string().optional().describe('User response'),
    groupActivityMembers: z.array(z.any()).describe('Group activity members'),
    submissionData: z.any().optional().describe('Submission data'),
    failedReason: z.string().optional().describe('Failed reason'),
    completedAt: z.date().optional().describe('Completed date'),
    claimedAt: z.date().optional().describe('Claimed date'),
    totalMagatamaPointAwarded: z.number().describe('Total magatama points awarded'),
    ...MetadataFieldsSchema,
});

export class UserTaskLogResponseDto extends createZodDto(UserTaskLogResponseSchema) {}
