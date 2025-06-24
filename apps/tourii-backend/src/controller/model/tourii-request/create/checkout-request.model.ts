import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Address validation schemas
const AddressSchema = z.object({
    addressLine1: z.string().min(1, 'Address line 1 is required').max(500),
    addressLine2: z.string().max(500).optional(),
    city: z.string().min(1, 'City is required').max(255),
    state: z.string().min(1, 'State is required').max(255),
    postalCode: z.string().min(1, 'Postal code is required').max(20),
    countryCode: z.string().regex(/^[A-Z]{2}$/, 'Invalid country code format'),
    country: z.string().min(1, 'Country is required').max(255),
});

const BillingAddressSchema = AddressSchema.extend({
    fullName: z.string().min(1, 'Full name is required').max(255),
    company: z.string().max(255).optional(),
    taxId: z.string().max(50).optional(),
});

const ShippingAddressSchema = AddressSchema.extend({
    recipientName: z.string().min(1, 'Recipient name is required').max(255),
    company: z.string().max(255).optional(),
    deliveryInstructions: z.string().max(500).optional(),
    deliveryPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone format').optional(),
});

export const CheckoutRequestSchema = z.object({
    paymentMethod: z.nativeEnum(PaymentMethod),
    customerEmail: z.string().email('Invalid email format').optional(),
    customerPhone: z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone format').optional(),
    billingAddress: BillingAddressSchema.optional(),
    shippingAddress: ShippingAddressSchema.optional(),
    customerNotes: z.string().max(1000).optional(),
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
        description: 'Customer email for notifications (RFC 5322 compliant)',
        example: 'customer@example.com',
        format: 'email',
        required: false,
    })
    customerEmail?: string;

    @ApiProperty({
        description: 'Customer phone number in international E.164 format',
        example: '+1234567890',
        pattern: '^\\+?[1-9]\\d{1,14}$',
        required: false,
    })
    customerPhone?: string;

    @ApiProperty({
        description: 'Billing address details with full validation',
        type: 'object',
        required: false,
        example: {
            addressLine1: '123 Main Street',
            addressLine2: 'Apartment 4B',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            countryCode: 'US',
            country: 'United States',
            fullName: 'John Doe',
            company: 'Acme Corp',
            taxId: '12-3456789'
        },
        properties: {
            addressLine1: { type: 'string', description: 'Street address line 1', maxLength: 500 },
            addressLine2: { type: 'string', description: 'Street address line 2', maxLength: 500 },
            city: { type: 'string', description: 'City name', maxLength: 255 },
            state: { type: 'string', description: 'State/Province/Region', maxLength: 255 },
            postalCode: { type: 'string', description: 'Postal/ZIP code', maxLength: 20 },
            countryCode: { type: 'string', description: 'ISO 3166-1 alpha-2 country code', pattern: '^[A-Z]{2}$' },
            country: { type: 'string', description: 'Full country name', maxLength: 255 },
            fullName: { type: 'string', description: 'Billing contact name', maxLength: 255 },
            company: { type: 'string', description: 'Company name', maxLength: 255 },
            taxId: { type: 'string', description: 'Tax ID or VAT number', maxLength: 50 }
        }
    })
    billingAddress?: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        countryCode: string;
        country: string;
        fullName: string;
        company?: string;
        taxId?: string;
    };

    @ApiProperty({
        description: 'Shipping address details with full validation',
        type: 'object',
        required: false,
        example: {
            addressLine1: '456 Oak Avenue',
            city: 'Los Angeles',
            state: 'CA',
            postalCode: '90210',
            countryCode: 'US',
            country: 'United States',
            recipientName: 'Jane Smith',
            deliveryInstructions: 'Leave at front door',
            deliveryPhone: '+1234567890'
        },
        properties: {
            addressLine1: { type: 'string', description: 'Street address line 1', maxLength: 500 },
            addressLine2: { type: 'string', description: 'Street address line 2', maxLength: 500 },
            city: { type: 'string', description: 'City name', maxLength: 255 },
            state: { type: 'string', description: 'State/Province/Region', maxLength: 255 },
            postalCode: { type: 'string', description: 'Postal/ZIP code', maxLength: 20 },
            countryCode: { type: 'string', description: 'ISO 3166-1 alpha-2 country code', pattern: '^[A-Z]{2}$' },
            country: { type: 'string', description: 'Full country name', maxLength: 255 },
            recipientName: { type: 'string', description: 'Recipient full name', maxLength: 255 },
            company: { type: 'string', description: 'Company name', maxLength: 255 },
            deliveryInstructions: { type: 'string', description: 'Special delivery instructions', maxLength: 500 },
            deliveryPhone: { type: 'string', description: 'Phone number for delivery contact', pattern: '^\\+?[1-9]\\d{1,14}$' }
        }
    })
    shippingAddress?: {
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        countryCode: string;
        country: string;
        recipientName: string;
        company?: string;
        deliveryInstructions?: string;
        deliveryPhone?: string;
    };

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