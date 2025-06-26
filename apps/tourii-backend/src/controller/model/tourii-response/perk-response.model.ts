import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

// ==========================================
// PERK INVENTORY RESPONSE MODELS
// ==========================================

export const PerkInventoryResponseSchema = z.object({
    perkId: z.string().describe('Unique perk identifier'),
    userId: z.string().describe('User who owns this perk'),
    onchainItemId: z.string().describe('Reference to catalog item'),
    acquisitionType: z.enum(['QUEST', 'PURCHASE', 'GIFT']).describe('How perk was acquired'),
    sourceId: z.string().nullable().describe('Quest ID or Order ID that generated this perk'),
    quantity: z.number().int().min(0).describe('Number of this perk owned'),
    expiryDate: z.string().datetime().nullable().describe('When perk expires (ISO string)'),
    status: z.enum(['ACTIVE', 'USED', 'EXPIRED', 'CANCELLED']).describe('Current perk status'),
    acquiredAt: z.string().datetime().describe('When perk was acquired (ISO string)'),
});

export class PerkInventoryResponseDto {
    @ApiProperty({ description: 'Unique perk identifier' })
    perkId: string;

    @ApiProperty({ description: 'User who owns this perk' })
    userId: string;

    @ApiProperty({ description: 'Reference to catalog item' })
    onchainItemId: string;

    @ApiProperty({ 
        enum: ['QUEST', 'PURCHASE', 'GIFT'],
        description: 'How perk was acquired' 
    })
    acquisitionType: 'QUEST' | 'PURCHASE' | 'GIFT';

    @ApiProperty({ 
        description: 'Quest ID or Order ID that generated this perk',
        nullable: true 
    })
    sourceId: string | null;

    @ApiProperty({ description: 'Number of this perk owned' })
    quantity: number;

    @ApiProperty({ 
        description: 'When perk expires (ISO string)',
        nullable: true 
    })
    expiryDate: string | null;

    @ApiProperty({ 
        enum: ['ACTIVE', 'USED', 'EXPIRED', 'CANCELLED'],
        description: 'Current perk status' 
    })
    status: 'ACTIVE' | 'USED' | 'EXPIRED' | 'CANCELLED';

    @ApiProperty({ description: 'When perk was acquired (ISO string)' })
    acquiredAt: string;
}

export const PerkUsageStatsResponseSchema = z.object({
    totalPerks: z.number().int().min(0).describe('Total perks owned'),
    activePerks: z.number().int().min(0).describe('Active/usable perks'),
    usedPerks: z.number().int().min(0).describe('Redeemed perks'),
    expiredPerks: z.number().int().min(0).describe('Expired perks'),
    perksByAcquisition: z.object({
        quest: z.number().int().min(0),
        purchase: z.number().int().min(0),
        gift: z.number().int().min(0),
    }).describe('Breakdown by acquisition method'),
    expiringCount: z.number().int().min(0).describe('Perks expiring within 7 days'),
});

export class PerkUsageStatsResponseDto {
    @ApiProperty({ description: 'Total perks owned' })
    totalPerks: number;

    @ApiProperty({ description: 'Active/usable perks' })
    activePerks: number;

    @ApiProperty({ description: 'Redeemed perks' })
    usedPerks: number;

    @ApiProperty({ description: 'Expired perks' })
    expiredPerks: number;

    @ApiProperty({ 
        description: 'Breakdown by acquisition method',
        type: 'object',
        properties: {
            quest: { type: 'number' },
            purchase: { type: 'number' },
            gift: { type: 'number' },
        }
    })
    perksByAcquisition: {
        quest: number;
        purchase: number;
        gift: number;
    };

    @ApiProperty({ description: 'Perks expiring within 7 days' })
    expiringCount: number;
}

// ==========================================
// PERK RESERVATION RESPONSE MODELS
// ==========================================

export const PerkReservationResponseSchema = z.object({
    reservationId: z.string().describe('Unique reservation identifier'),
    perkId: z.string().describe('Associated perk ID'),
    userId: z.string().describe('User who made the reservation'),
    reservationDate: z.string().datetime().describe('Date/time of reservation (ISO string)'),
    partySize: z.number().int().min(1).max(20).describe('Number of people'),
    specialRequests: z.string().nullable().describe('Special requests or notes'),
    redemptionLocation: z.string().nullable().describe('Where perk can be redeemed'),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']).describe('Reservation status'),
    qrCodeData: z.string().nullable().describe('QR code for redemption'),
    qrExpiryDate: z.string().datetime().nullable().describe('QR code expiry (ISO string)'),
    createdAt: z.string().datetime().describe('When reservation was created (ISO string)'),
});

export class PerkReservationResponseDto {
    @ApiProperty({ description: 'Unique reservation identifier' })
    reservationId: string;

    @ApiProperty({ description: 'Associated perk ID' })
    perkId: string;

    @ApiProperty({ description: 'User who made the reservation' })
    userId: string;

    @ApiProperty({ description: 'Date/time of reservation (ISO string)' })
    reservationDate: string;

    @ApiProperty({ description: 'Number of people', minimum: 1, maximum: 20 })
    partySize: number;

    @ApiProperty({ 
        description: 'Special requests or notes',
        nullable: true 
    })
    specialRequests: string | null;

    @ApiProperty({ 
        description: 'Where perk can be redeemed',
        nullable: true 
    })
    redemptionLocation: string | null;

    @ApiProperty({ 
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        description: 'Reservation status' 
    })
    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

    @ApiProperty({ 
        description: 'QR code for redemption',
        nullable: true 
    })
    qrCodeData: string | null;

    @ApiProperty({ 
        description: 'QR code expiry (ISO string)',
        nullable: true 
    })
    qrExpiryDate: string | null;

    @ApiProperty({ description: 'When reservation was created (ISO string)' })
    createdAt: string;
}

// ==========================================
// QR CODE RESPONSE MODELS
// ==========================================

export const QRCodeResponseSchema = z.object({
    qrCodeData: z.string().describe('Generated QR code data'),
    qrCodeUrl: z.string().url().nullable().describe('QR code image URL (if generated)'),
    expiryDate: z.string().datetime().describe('When QR code expires (ISO string)'),
    locationCode: z.string().describe('Location where QR can be redeemed'),
    reservationId: z.string().describe('Associated reservation ID'),
});

export class QRCodeResponseDto {
    @ApiProperty({ description: 'Generated QR code data' })
    qrCodeData: string;

    @ApiProperty({ 
        description: 'QR code image URL (if generated)',
        nullable: true 
    })
    qrCodeUrl: string | null;

    @ApiProperty({ description: 'When QR code expires (ISO string)' })
    expiryDate: string;

    @ApiProperty({ description: 'Location where QR can be redeemed' })
    locationCode: string;

    @ApiProperty({ description: 'Associated reservation ID' })
    reservationId: string;
}

export const QRValidationResponseSchema = z.object({
    isValid: z.boolean().describe('Whether QR code is valid'),
    errorMessage: z.string().nullable().describe('Error message if invalid'),
    reservationId: z.string().nullable().describe('Associated reservation ID'),
    perkId: z.string().nullable().describe('Associated perk ID'),
    userId: z.string().nullable().describe('User who owns the perk'),
    expiryDate: z.string().datetime().nullable().describe('QR expiry date (ISO string)'),
    locationCode: z.string().nullable().describe('Valid location code'),
});

export class QRValidationResponseDto {
    @ApiProperty({ description: 'Whether QR code is valid' })
    isValid: boolean;

    @ApiProperty({ 
        description: 'Error message if invalid',
        nullable: true 
    })
    errorMessage: string | null;

    @ApiProperty({ 
        description: 'Associated reservation ID',
        nullable: true 
    })
    reservationId: string | null;

    @ApiProperty({ 
        description: 'Associated perk ID',
        nullable: true 
    })
    perkId: string | null;

    @ApiProperty({ 
        description: 'User who owns the perk',
        nullable: true 
    })
    userId: string | null;

    @ApiProperty({ 
        description: 'QR expiry date (ISO string)',
        nullable: true 
    })
    expiryDate: string | null;

    @ApiProperty({ 
        description: 'Valid location code',
        nullable: true 
    })
    locationCode: string | null;
}