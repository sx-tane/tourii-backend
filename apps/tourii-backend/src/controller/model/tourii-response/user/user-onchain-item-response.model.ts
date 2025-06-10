import { BlockchainType, OnchainItemStatus, OnchainItemType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const UserOnchainItemResponseSchema = z.object({
    userOnchainItemId: z.string().describe('Onchain item ID'),
    userId: z.string().optional().describe('User ID'),
    itemType: z.nativeEnum(OnchainItemType).describe('Item type'),
    itemTxnHash: z.string().describe('Transaction hash'),
    blockchainType: z.nativeEnum(BlockchainType).describe('Blockchain type'),
    mintedAt: z.date().optional().describe('Minted date'),
    onchainItemId: z.string().optional().describe('Onchain item ID'),
    status: z.nativeEnum(OnchainItemStatus).describe('Item status'),
    ...MetadataFieldsSchema,
});

export class UserOnchainItemResponseDto extends createZodDto(UserOnchainItemResponseSchema) {}
