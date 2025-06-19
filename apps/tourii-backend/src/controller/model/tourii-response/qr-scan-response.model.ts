import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const QrScanResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
    taskId: z.string(),
    questId: z.string(),
    magatama_point_awarded: z.number(),
    completed_at: z.string().datetime(),
});

export class QrScanResponseDto extends createZodDto(QrScanResponseSchema) {}