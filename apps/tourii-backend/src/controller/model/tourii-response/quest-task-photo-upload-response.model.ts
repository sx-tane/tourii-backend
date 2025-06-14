import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QuestTaskPhotoUploadResponseSchema = z.object({
    message: z.string().describe('Result message for photo upload'),
    proofUrl: z.string().url().describe('Public URL for the uploaded proof image'),
});

export class QuestTaskPhotoUploadResponseDto extends createZodDto(QuestTaskPhotoUploadResponseSchema) {}
