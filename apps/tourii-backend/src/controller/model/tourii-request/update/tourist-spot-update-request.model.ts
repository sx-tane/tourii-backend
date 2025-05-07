import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { TouristSpotCreateRequestSchema } from '../create/tourist-spot-create-request.model';

export const TouristSpotUpdateRequestSchema = TouristSpotCreateRequestSchema.extend({
    touristSpotId: z.string().describe('Unique identifier for the tourist spot'),
    delFlag: z.boolean().describe('Flag to indicate if the tourist spot is deleted'),
    updUserId: z.string().describe('Unique identifier for the user who updated the tourist spot'),
});

export class TouristSpotUpdateRequestDto extends createZodDto(TouristSpotUpdateRequestSchema) {}
