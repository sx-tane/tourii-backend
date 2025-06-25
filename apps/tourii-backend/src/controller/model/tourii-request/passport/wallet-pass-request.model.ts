import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const WalletPassGenerateRequestSchema = z.object({
    tokenId: z.string().describe('Token ID of the Digital Passport NFT'),
});

export const WalletPassUpdateRequestSchema = z.object({
    tokenId: z.string().describe('Token ID of the Digital Passport NFT'),
    platform: z.enum(['apple', 'google']).describe('Wallet platform to update'),
});

export class WalletPassGenerateRequestDto extends createZodDto(WalletPassGenerateRequestSchema) {}
export class WalletPassUpdateRequestDto extends createZodDto(WalletPassUpdateRequestSchema) {}
