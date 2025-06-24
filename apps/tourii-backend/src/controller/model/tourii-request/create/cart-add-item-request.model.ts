import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const AddToCartRequestSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1').default(1),
});

export class AddToCartRequestDto extends createZodDto(AddToCartRequestSchema) {
    @ApiProperty({
        description: 'ID of the product to add to cart',
        example: 'UCT2025051-abc-1234567-def-12345',
    })
    productId: string;

    @ApiProperty({
        description: 'Quantity of the product to add',
        example: 1,
        default: 1,
        minimum: 1,
    })
    quantity: number;
}