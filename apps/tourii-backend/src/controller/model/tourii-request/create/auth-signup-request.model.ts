import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AuthSignupRequestSchema = z.object({
    email: z.string().email().describe('Email address for signup'),
    socialProvider: z.string().describe('Social provider for signup'),
    socialId: z.string().describe('Social ID for signup'),
});

export class AuthSignupRequestDto extends createZodDto(AuthSignupRequestSchema) {}
