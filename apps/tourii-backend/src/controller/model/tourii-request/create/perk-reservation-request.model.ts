import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

// ==========================================
// PERK RESERVATION CREATE REQUEST
// ==========================================

export const CreatePerkReservationRequestSchema = z.object({
    perkId: z.string().min(1, 'Perk ID is required').describe('ID of the perk to reserve'),
    reservationDate: z.string()
        .datetime('Invalid date format, use ISO string')
        .describe('Date and time for the reservation (ISO string)'),
    partySize: z.number()
        .int('Party size must be an integer')
        .min(1, 'Party size must be at least 1')
        .max(20, 'Party size cannot exceed 20')
        .describe('Number of people for the reservation'),
    specialRequests: z.string()
        .max(500, 'Special requests cannot exceed 500 characters')
        .optional()
        .describe('Optional special requests or notes'),
    redemptionLocation: z.string()
        .min(1, 'Redemption location is required')
        .max(100, 'Location code cannot exceed 100 characters')
        .describe('Location where the perk will be redeemed'),
});

export class CreatePerkReservationRequestDto {
    @ApiProperty({ 
        description: 'ID of the perk to reserve',
        example: 'UPI202506-abc-123456-def-78901'
    })
    perkId: string;

    @ApiProperty({ 
        description: 'Date and time for the reservation (ISO string)',
        example: '2025-07-15T18:00:00.000Z'
    })
    reservationDate: string;

    @ApiProperty({ 
        description: 'Number of people for the reservation',
        minimum: 1,
        maximum: 20,
        example: 2
    })
    partySize: number;

    @ApiProperty({ 
        description: 'Optional special requests or notes',
        required: false,
        maxLength: 500,
        example: 'Window table preferred, one vegetarian meal'
    })
    specialRequests?: string;

    @ApiProperty({ 
        description: 'Location where the perk will be redeemed',
        maxLength: 100,
        example: 'TOKYO_RESTAURANT_001'
    })
    redemptionLocation: string;
}

// ==========================================
// QR CODE GENERATION REQUEST
// ==========================================

export const GenerateQRRequestSchema = z.object({
    locationCode: z.string()
        .min(1, 'Location code is required')
        .max(50, 'Location code cannot exceed 50 characters')
        .describe('Location where QR can be redeemed'),
    expiryHours: z.number()
        .int('Expiry hours must be an integer')
        .min(1, 'Expiry must be at least 1 hour')
        .max(168, 'Expiry cannot exceed 168 hours (7 days)')
        .default(2)
        .describe('Hours until QR code expires'),
});

export class GenerateQRRequestDto {
    @ApiProperty({ 
        description: 'Location where QR can be redeemed',
        maxLength: 50,
        example: 'TOKYO_RESTAURANT_001'
    })
    locationCode: string;

    @ApiProperty({ 
        description: 'Hours until QR code expires',
        minimum: 1,
        maximum: 168,
        default: 2,
        example: 2
    })
    expiryHours: number = 2;
}

// ==========================================
// GIFT PERK REQUEST
// ==========================================

export const GiftPerkRequestSchema = z.object({
    toUserId: z.string()
        .min(1, 'Recipient user ID is required')
        .describe('User ID of the gift recipient'),
    message: z.string()
        .max(200, 'Gift message cannot exceed 200 characters')
        .optional()
        .describe('Optional gift message'),
});

export class GiftPerkRequestDto {
    @ApiProperty({ 
        description: 'User ID of the gift recipient',
        example: 'USR202506-xyz-789012-abc-34567'
    })
    toUserId: string;

    @ApiProperty({ 
        description: 'Optional gift message',
        required: false,
        maxLength: 200,
        example: 'Happy birthday! Enjoy this restaurant voucher!'
    })
    message?: string;
}