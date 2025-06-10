import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UserProfileResponseSchema = z.object({
    userId: z.string().describe('User ID'),
    username: z.string().describe('Username'),
    passportType: z.string().describe('Digital passport type'),
    level: z.string().describe('User level'),
    title: z.string().describe('User title or status'),
});

export class UserProfileResponseDto extends createZodDto(UserProfileResponseSchema) {}
