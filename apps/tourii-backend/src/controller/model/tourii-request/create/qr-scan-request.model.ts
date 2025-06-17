import { z } from 'zod';
import { createZodDto } from 'nestjs-zod';

export const QrScanRequestSchema = z.object({
    code: z.string().min(1, 'QR code cannot be empty').trim(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

export class QrScanRequestDto extends createZodDto(QrScanRequestSchema) {}