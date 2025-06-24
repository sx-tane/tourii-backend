import { ApiProperty } from '@nestjs/swagger';
import { TransformDate } from '@app/core';

export class CartItemResponseDto {
    @ApiProperty({
        description: 'Cart item ID',
        example: 'UCT2025051-abc-1234567-def-12345',
    })
    cartId: string;

    @ApiProperty({
        description: 'Product ID',
        example: 'UOI2025051-xyz-7890123-ghi-67890',
    })
    productId: string;

    @ApiProperty({
        description: 'Product name',
        example: 'Premium Tokyo Tour Package',
    })
    productName: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Exclusive guided tour of Tokyo with local expert',
    })
    productDescription?: string;

    @ApiProperty({
        description: 'Product image URL',
        example: 'https://example.com/product-image.jpg',
    })
    productImageUrl?: string;

    @ApiProperty({
        description: 'Unit price of the product',
        example: 89.99,
    })
    unitPrice: number;

    @ApiProperty({
        description: 'Quantity in cart',
        example: 1,
    })
    quantity: number;

    @ApiProperty({
        description: 'Total price for this line item',
        example: 89.99,
    })
    totalPrice: number;

    @ApiProperty({
        description: 'When item was added to cart',
        example: '2025-06-24T05:45:00.000Z',
    })
    @TransformDate
    addedAt: Date;
}

export class CartResponseDto {
    @ApiProperty({
        description: 'Cart items',
        type: [CartItemResponseDto],
    })
    items: CartItemResponseDto[];

    @ApiProperty({
        description: 'Total number of items in cart',
        example: 3,
    })
    totalItems: number;

    @ApiProperty({
        description: 'Total cart value',
        example: 269.97,
    })
    totalValue: number;

    @ApiProperty({
        description: 'Currency code',
        example: 'USD',
    })
    currency: string;
}