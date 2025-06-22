import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const QrScanRequestSchema = z.object({
    code: z
        .string()
        .min(1, 'QR code cannot be empty')
        .max(1000, 'QR code too long')
        .regex(/^[A-Za-z0-9_\-:./#]+$/, 'QR code contains invalid characters')
        .trim(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

export class QrScanRequestDto extends createZodDto(QrScanRequestSchema) {}
