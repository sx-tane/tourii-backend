import { ItemStatus, ItemType } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const UserItemClaimLogResponseSchema = z.object({
    userItemClaimLogId: z.string().describe('Item claim log ID'),
    userId: z.string().describe('User ID'),
    onchainItemId: z.string().optional().describe('Onchain item ID'),
    offchainItemName: z.string().optional().describe('Offchain item name'),
    itemAmount: z.number().describe('Item amount'),
    itemDetails: z.string().optional().describe('Item details'),
    type: z.nativeEnum(ItemType).describe('Item type'),
    claimedAt: z.date().optional().describe('Claimed date'),
    status: z.nativeEnum(ItemStatus).describe('Claim status'),
    errorMsg: z.string().optional().describe('Error message'),
    ...MetadataFieldsSchema,
});

export class UserItemClaimLogResponseDto extends createZodDto(UserItemClaimLogResponseSchema) {}
