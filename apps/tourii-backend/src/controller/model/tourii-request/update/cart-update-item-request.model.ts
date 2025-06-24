import { ApiProperty } from '@nestjs/swagger';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const UpdateCartItemRequestSchema = z.object({
    quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export class UpdateCartItemRequestDto extends createZodDto(UpdateCartItemRequestSchema) {
    @ApiProperty({
        description: 'New quantity for the cart item',
        example: 2,
        minimum: 1,
    })
    quantity: number;
}