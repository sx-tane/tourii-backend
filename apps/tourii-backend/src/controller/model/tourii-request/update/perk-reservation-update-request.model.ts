import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';

// ==========================================
// PERK RESERVATION UPDATE REQUEST
// ==========================================

export const UpdatePerkReservationRequestSchema = z.object({
    reservationDate: z.string()
        .datetime('Invalid date format, use ISO string')
        .optional()
        .describe('New date and time for the reservation (ISO string)'),
    partySize: z.number()
        .int('Party size must be an integer')
        .min(1, 'Party size must be at least 1')
        .max(20, 'Party size cannot exceed 20')
        .optional()
        .describe('New number of people for the reservation'),
    specialRequests: z.string()
        .max(500, 'Special requests cannot exceed 500 characters')
        .optional()
        .nullable()
        .describe('Updated special requests or notes (null to clear)'),
});

export class UpdatePerkReservationRequestDto {
    @ApiProperty({ 
        description: 'New date and time for the reservation (ISO string)',
        required: false,
        example: '2025-07-16T19:00:00.000Z'
    })
    reservationDate?: string;

    @ApiProperty({ 
        description: 'New number of people for the reservation',
        required: false,
        minimum: 1,
        maximum: 20,
        example: 4
    })
    partySize?: number;

    @ApiProperty({ 
        description: 'Updated special requests or notes (null to clear)',
        required: false,
        nullable: true,
        maxLength: 500,
        example: 'Changed to table for 4, still prefer window seating'
    })
    specialRequests?: string | null;
}

// ==========================================
// QR REDEMPTION REQUEST
// ==========================================

export const QRRedemptionRequestSchema = z.object({
    qrCodeData: z.string()
        .min(1, 'QR code data is required')
        .describe('QR code data to redeem'),
    redeemedBy: z.string()
        .min(1, 'Staff identifier is required')
        .max(100, 'Staff identifier cannot exceed 100 characters')
        .describe('Staff member or partner who validated the QR'),
});

export class QRRedemptionRequestDto {
    @ApiProperty({ 
        description: 'QR code data to redeem',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    })
    qrCodeData: string;

    @ApiProperty({ 
        description: 'Staff member or partner who validated the QR',
        maxLength: 100,
        example: 'staff_member_001'
    })
    redeemedBy: string;
}