import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { UserTravelLogResponseSchema } from './user-travel-log-response.model';

export const UserTravelLogListResponseSchema = z.object({
    checkins: z.array(UserTravelLogResponseSchema).describe('List of user travel log checkins'),
    pagination: z
        .object({
            currentPage: z.number().describe('Current page number'),
            totalPages: z.number().describe('Total number of pages'),
            totalItems: z.number().describe('Total number of items'),
        })
        .describe('Pagination information'),
});

export class UserTravelLogListResponseDto extends createZodDto(UserTravelLogListResponseSchema) {}
