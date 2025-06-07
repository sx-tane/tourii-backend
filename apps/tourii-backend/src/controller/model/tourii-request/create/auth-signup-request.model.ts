import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AuthSignupRequestSchema = z.object({
    email: z.string().email(),
    socialProvider: z.string(),
    socialId: z.string(),
});

export class AuthSignupRequestDto extends createZodDto(AuthSignupRequestSchema) {}
