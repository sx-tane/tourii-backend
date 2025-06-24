import { ApiProperty } from '@nestjs/swagger';
import { OnchainItemType } from '@prisma/client';
import { TransformDate } from '@app/core';

export class ProductResponseDto {
    @ApiProperty({
        description: 'Product ID',
        example: 'UOI2025051-xyz-7890123-ghi-67890',
    })
    productId: string;

    @ApiProperty({
        description: 'Product name',
        example: 'Premium Tokyo Tour Package',
    })
    name: string;

    @ApiProperty({
        description: 'Product description',
        example: 'Exclusive guided tour of Tokyo with local expert',
    })
    description?: string;

    @ApiProperty({
        description: 'Product price',
        example: 89.99,
    })
    price: number;

    @ApiProperty({
        description: 'Currency code',
        example: 'USD',
    })
    currency: string;

    @ApiProperty({
        description: 'Product image URL',
        example: 'https://example.com/product-image.jpg',
    })
    imageUrl?: string;

    @ApiProperty({
        description: 'Product category',
        enum: OnchainItemType,
        example: OnchainItemType.PERK,
    })
    category: OnchainItemType;

    @ApiProperty({
        description: 'Whether product is currently available',
        example: true,
    })
    isAvailable: boolean;

    @ApiProperty({
        description: 'Available stock quantity',
        example: 100,
        required: false,
    })
    stockQuantity?: number;

    @ApiProperty({
        description: 'Product metadata',
        type: 'object',
        required: false,
    })
    metadata?: Record<string, any>;

    @ApiProperty({
        description: 'When product was created',
        example: '2025-06-24T05:45:00.000Z',
    })
    @TransformDate
    createdAt: Date;

    @ApiProperty({
        description: 'When product was last updated',
        example: '2025-06-24T05:45:00.000Z',
    })
    @TransformDate
    updatedAt: Date;
}

export class ProductCatalogResponseDto {
    @ApiProperty({
        description: 'Available products',
        type: [ProductResponseDto],
    })
    products: ProductResponseDto[];

    @ApiProperty({
        description: 'Total number of products',
        example: 25,
    })
    totalProducts: number;

    @ApiProperty({
        description: 'Current page number',
        example: 1,
    })
    currentPage: number;

    @ApiProperty({
        description: 'Number of products per page',
        example: 10,
    })
    pageSize: number;

    @ApiProperty({
        description: 'Total number of pages',
        example: 3,
    })
    totalPages: number;

    @ApiProperty({
        description: 'Available product categories',
        type: [String],
        example: ['PERK', 'COLLECTIBLE'],
    })
    categories: string[];
}