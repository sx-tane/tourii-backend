import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LoginRequestSchema = z.object({
    username: z.string().optional().describe('Username for login'),
    password: z.string().describe('User password'),
    passportWalletAddress: z.string().optional().describe('Passport wallet address to validate'),
    discordId: z.string().optional().describe('Discord user ID'),
    googleEmail: z.string().optional().describe('Google email address'),
});

export class LoginRequestDto extends createZodDto(LoginRequestSchema) {}
