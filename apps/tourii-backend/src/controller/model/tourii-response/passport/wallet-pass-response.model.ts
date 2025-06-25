import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const WalletPassResultSchema = z.object({
    tokenId: z.string().describe('Token ID of the Digital Passport NFT'),
    platform: z.enum(['apple', 'google']).describe('Wallet platform (apple or google)'),
    downloadUrl: z.string().url().optional().describe('Direct download URL for Apple passes'),
    redirectUrl: z.string().url().describe('URL to add pass to wallet'),
    expiresAt: z.string().datetime().describe('Pass expiration timestamp'),
    passBuffer: z.any().optional().describe('Pass file buffer (for direct downloads)'),
});

export const BothWalletPassesResultSchema = z.object({
    tokenId: z.string().describe('Token ID of the Digital Passport NFT'),
    apple: WalletPassResultSchema.describe('Apple Wallet pass data'),
    google: WalletPassResultSchema.describe('Google Pay pass data'),
});

export const PassStatusSchema = z.object({
    valid: z.boolean().describe('Whether the token ID is valid'),
    tokenId: z.string().describe('The token ID that was validated'),
});

export class WalletPassResultDto extends createZodDto(WalletPassResultSchema) {}
export class BothWalletPassesResultDto extends createZodDto(BothWalletPassesResultSchema) {}
export class PassStatusDto extends createZodDto(PassStatusSchema) {}
