import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AuthSignupResponseSchema = z.object({
    userId: z.string().describe('Unique identifier for the user'),
    walletAddress: z.string().describe('Wallet address for the user'),
});

export class AuthSignupResponseDto extends createZodDto(AuthSignupResponseSchema) {}
