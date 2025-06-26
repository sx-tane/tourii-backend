import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, PaymentMethod, PaymentStatus } from '@prisma/client';
import { TransformDate } from '@app/core';

export class OrderItemResponseDto {
    @ApiProperty({
        description: 'Order item ID',
        example: 'UOI2025051-abc-1234567-def-12345',
    })
    orderItemId: string;

    @ApiProperty({
        description: 'Product ID',
        example: 'UOI2025051-xyz-7890123-ghi-67890',
    })
    productId: string;

    @ApiProperty({
        description: 'Product name at time of purchase',
        example: 'Premium Tokyo Tour Package',
    })
    productName: string;

    @ApiProperty({
        description: 'Product description at time of purchase',
        example: 'Exclusive guided tour of Tokyo with local expert',
    })
    productDescription?: string;

    @ApiProperty({
        description: 'Product image URL at time of purchase',
        example: 'https://example.com/product-image.jpg',
    })
    productImageUrl?: string;

    @ApiProperty({
        description: 'Quantity ordered',
        example: 1,
    })
    quantity: number;

    @ApiProperty({
        description: 'Unit price at time of purchase',
        example: 89.99,
    })
    unitPrice: number;

    @ApiProperty({
        description: 'Total price for this line item',
        example: 89.99,
    })
    totalPrice: number;

    @ApiProperty({
        description: 'Individual item status',
        enum: OrderStatus,
        example: OrderStatus.FULFILLED,
    })
    itemStatus: OrderStatus;

    @ApiProperty({
        description: 'When this item was fulfilled',
        example: '2025-06-24T10:30:00.000Z',
        required: false,
    })
    @TransformDate
    fulfilledAt?: Date;

    @ApiProperty({
        description: 'Blockchain transaction hash for perk minting',
        example: '0x1234567890abcdef...',
        required: false,
    })
    blockchainTxnHash?: string;

    @ApiProperty({
        description: 'Item-specific fulfillment notes',
        example: 'Perk NFT minted successfully',
        required: false,
    })
    fulfillmentNotes?: string;
}

export class OrderResponseDto {
    @ApiProperty({
        description: 'Order ID',
        example: 'UOR2025051-abc-1234567-def-12345',
    })
    orderId: string;

    @ApiProperty({
        description: 'Order status',
        enum: OrderStatus,
        example: OrderStatus.COMPLETED,
    })
    orderStatus: OrderStatus;

    @ApiProperty({
        description: 'Subtotal amount',
        example: 269.97,
    })
    subtotalAmount: number;

    @ApiProperty({
        description: 'Tax amount',
        example: 21.60,
    })
    taxAmount: number;

    @ApiProperty({
        description: 'Shipping amount',
        example: 0.00,
    })
    shippingAmount: number;

    @ApiProperty({
        description: 'Total amount',
        example: 291.57,
    })
    totalAmount: number;

    @ApiProperty({
        description: 'Currency code',
        example: 'USD',
    })
    currency: string;

    @ApiProperty({
        description: 'Payment method used',
        enum: PaymentMethod,
        example: PaymentMethod.STRIPE,
    })
    paymentMethod: PaymentMethod;

    @ApiProperty({
        description: 'Payment status',
        enum: PaymentStatus,
        example: PaymentStatus.COMPLETED,
    })
    paymentStatus: PaymentStatus;

    @ApiProperty({
        description: 'Payment transaction ID',
        example: 'pi_1234567890abcdef',
        required: false,
    })
    paymentTransactionId?: string;

    @ApiProperty({
        description: 'Payment processing fees',
        example: 8.75,
    })
    paymentFees: number;

    @ApiProperty({
        description: 'When order was placed',
        example: '2025-06-24T05:45:00.000Z',
    })
    @TransformDate
    orderDate: Date;

    @ApiProperty({
        description: 'When payment was completed',
        example: '2025-06-24T05:46:00.000Z',
        required: false,
    })
    @TransformDate
    paymentCompletedAt?: Date;

    @ApiProperty({
        description: 'When order processing started',
        example: '2025-06-24T06:00:00.000Z',
        required: false,
    })
    @TransformDate
    processingStartedAt?: Date;

    @ApiProperty({
        description: 'When order was fulfilled',
        example: '2025-06-24T10:30:00.000Z',
        required: false,
    })
    @TransformDate
    fulfilledAt?: Date;

    @ApiProperty({
        description: 'When order was completed',
        example: '2025-06-24T11:00:00.000Z',
        required: false,
    })
    @TransformDate
    completedAt?: Date;

    @ApiProperty({
        description: 'Estimated delivery date',
        example: '2025-06-26T12:00:00.000Z',
        required: false,
    })
    @TransformDate
    estimatedDeliveryDate?: Date;

    @ApiProperty({
        description: 'Customer email',
        example: 'customer@example.com',
        required: false,
    })
    customerEmail?: string;

    @ApiProperty({
        description: 'Customer phone',
        example: '+1234567890',
        required: false,
    })
    customerPhone?: string;

    @ApiProperty({
        description: 'Billing address',
        type: 'object',
        required: false,
    })
    billingAddress?: Record<string, any>;

    @ApiProperty({
        description: 'Shipping address',
        type: 'object',
        required: false,
    })
    shippingAddress?: Record<string, any>;

    @ApiProperty({
        description: 'Customer notes',
        example: 'Please deliver after 5 PM',
        required: false,
    })
    customerNotes?: string;

    @ApiProperty({
        description: 'Fulfillment notes',
        example: 'All items processed successfully',
        required: false,
    })
    fulfillmentNotes?: string;

    @ApiProperty({
        description: 'Order items',
        type: [OrderItemResponseDto],
    })
    orderItems: OrderItemResponseDto[];

    @ApiProperty({
        description: 'Total number of items in order',
        example: 3,
    })
    totalItemCount: number;

    @ApiProperty({
        description: 'Order age in days',
        example: 2,
    })
    ageInDays: number;
}

export class CheckoutResponseDto {
    @ApiProperty({
        description: 'Created order details',
        type: OrderResponseDto,
    })
    order: OrderResponseDto;

    @ApiProperty({
        description: 'Payment intent information for client-side processing',
        type: 'object',
    })
    paymentIntent?: Record<string, any>;

    @ApiProperty({
        description: 'Estimated time for manual review (for certain payment methods)',
        example: '24 hours',
        required: false,
    })
    estimatedReviewTime?: string;
}