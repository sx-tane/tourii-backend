import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CheckinsFetchRequestSchema = z.object({
    page: z
        .string()
        .optional()
        .default('1')
        .transform((val) => Number.parseInt(val, 10))
        .refine((val) => val >= 1, { message: 'Page must be greater than or equal to 1' })
        .describe('Page number (default: 1)'),
    limit: z
        .string()
        .optional()
        .default('20')
        .transform((val) => Number.parseInt(val, 10))
        .refine((val) => val >= 1 && val <= 100, { 
            message: 'Limit must be between 1 and 100' 
        })
        .describe('Items per page (default: 20, max: 100)'),
    userId: z
        .string()
        .optional()
        .describe('Filter by specific user ID (admin only)'),
    questId: z
        .string()
        .optional()
        .describe('Filter by specific quest ID'),
    touristSpotId: z
        .string()
        .optional()
        .describe('Filter by specific tourist spot ID'),
    checkInMethod: z
        .enum(['QR_CODE', 'GPS', 'AUTO_DETECTED', 'BACKGROUND_GPS'])
        .optional()
        .describe('Filter by check-in method'),
    source: z
        .enum(['manual', 'auto'])
        .optional()
        .describe('Filter by source type (manual=QR_CODE|GPS, auto=AUTO_DETECTED|BACKGROUND_GPS)'),
    startDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: 'Start date must be a valid ISO date string'
        })
        .transform((val) => val ? new Date(val) : undefined)
        .describe('Filter from date (ISO format)'),
    endDate: z
        .string()
        .optional()
        .refine((val) => !val || !isNaN(Date.parse(val)), {
            message: 'End date must be a valid ISO date string'
        })
        .transform((val) => val ? new Date(val) : undefined)
        .describe('Filter to date (ISO format)'),
});

export class CheckinsFetchRequestDto extends createZodDto(CheckinsFetchRequestSchema) {}