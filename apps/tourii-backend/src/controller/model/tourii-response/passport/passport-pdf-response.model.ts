import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const PassportPdfResponseSchema = z.object({
    tokenId: z.string().describe('The token ID of the Digital Passport NFT'),
    downloadUrl: z.string().url().describe('URL to download the generated PDF'),
    qrCode: z.string().describe('JWT token for QR code verification'),
    expiresAt: z.string().datetime().describe('Expiration date of the PDF'),
});

export class PassportPdfResponseDto extends createZodDto(PassportPdfResponseSchema) {}
