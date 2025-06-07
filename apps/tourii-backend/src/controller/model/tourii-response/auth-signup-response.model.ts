import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AuthSignupResponseSchema = z.object({
    userId: z.string(),
    walletAddress: z.string(),
});

export class AuthSignupResponseDto extends createZodDto(AuthSignupResponseSchema) {}
