import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CheckoutRequestSchema = z.object({
    paymentMethod: z.nativeEnum(PaymentMethod),
    customerEmail: z.string().email().optional(),
    customerPhone: z.string().optional(),
    billingAddress: z.record(z.any()).optional(),
    shippingAddress: z.record(z.any()).optional(),
    customerNotes: z.string().optional(),
    paymentMethodData: z.record(z.any()).optional(),
});

export class CheckoutRequestDto extends createZodDto(CheckoutRequestSchema) {
    @ApiProperty({
        description: 'Payment method for the order',
        enum: PaymentMethod,
        example: PaymentMethod.STRIPE,
    })
    paymentMethod: PaymentMethod;

    @ApiProperty({
        description: 'Customer email for notifications',
        example: 'customer@example.com',
        required: false,
    })
    customerEmail?: string;

    @ApiProperty({
        description: 'Customer phone number',
        example: '+1234567890',
        required: false,
    })
    customerPhone?: string;

    @ApiProperty({
        description: 'Billing address details',
        type: 'object',
        required: false,
    })
    billingAddress?: Record<string, any>;

    @ApiProperty({
        description: 'Shipping address details',
        type: 'object',
        required: false,
    })
    shippingAddress?: Record<string, any>;

    @ApiProperty({
        description: 'Special instructions from customer',
        example: 'Please deliver after 5 PM',
        required: false,
    })
    customerNotes?: string;

    @ApiProperty({
        description: 'Payment method specific data (e.g., credit card details)',
        type: 'object',
        required: false,
    })
    paymentMethodData?: Record<string, any>;
}