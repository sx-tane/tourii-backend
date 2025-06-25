import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PassportDataSchema = z.object({
    username: z.string().describe('Username of the passport holder'),
    level: z.string().describe('User level (e.g., E-Class Amatsukami)'),
    passportType: z.string().describe('Type of passport (e.g., Amatsukami)'),
    questsCompleted: z.number().int().describe('Number of quests completed'),
    travelDistance: z.number().describe('Total travel distance in km'),
    magatamaPoints: z.number().int().describe('Total Magatama points earned'),
    registeredAt: z.string().datetime().describe('Registration date'),
});

export const VerificationResultSchema = z.object({
    valid: z.boolean().describe('Whether the verification was successful'),
    tokenId: z.string().describe('Token ID of the verified passport'),
    verifiedAt: z.string().datetime().describe('Timestamp of verification'),
    expiresAt: z.string().datetime().optional().describe('Token expiration timestamp'),
    passportData: PassportDataSchema.optional().describe(
        'Passport holder data if verification successful',
    ),
    error: z.string().optional().describe('Error message if verification failed'),
});

export const BatchVerificationSummarySchema = z.object({
    total: z.number().int().describe('Total number of tokens verified'),
    valid: z.number().int().describe('Number of valid tokens'),
    invalid: z.number().int().describe('Number of invalid tokens'),
});

export const BatchVerificationResultSchema = z.object({
    results: z.array(VerificationResultSchema).describe('Individual verification results'),
    summary: BatchVerificationSummarySchema.describe('Summary statistics'),
});

export const PopularPassportSchema = z.object({
    tokenId: z.string().describe('Token ID'),
    username: z.string().describe('Username'),
    verificationCount: z.number().int().describe('Number of verifications'),
});

export const VerificationStatsSchema = z.object({
    tokenId: z.string().optional().describe('Token ID if specific stats requested'),
    totalVerifications: z.number().int().describe('Total verification count'),
    todayVerifications: z.number().int().describe('Verifications today'),
    lastVerified: z.string().datetime().optional().describe('Last verification timestamp'),
    popularPassports: z.array(PopularPassportSchema).optional().describe('Most verified passports'),
});

export class PassportDataDto extends createZodDto(PassportDataSchema) {}
export class VerificationResultDto extends createZodDto(VerificationResultSchema) {}
export class BatchVerificationResultDto extends createZodDto(BatchVerificationResultSchema) {}
export class VerificationStatsDto extends createZodDto(VerificationStatsSchema) {}
