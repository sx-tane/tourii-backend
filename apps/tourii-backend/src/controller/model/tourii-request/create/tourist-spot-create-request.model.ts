import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const ImageSetSchema = z.object({
    main: z.string().describe('Main image of the tourist spot'),
    small: z.array(z.string()).describe('Small images of the tourist spot'),
});

export const TouristSpotCreateRequestSchema = z.object({
    storyChapterId: z.string().describe('Unique identifier for the story chapter'),
    touristSpotName: z.string().describe('Name of the tourist spot'),
    touristSpotDesc: z.string().describe('Description of the tourist spot'),
    bestVisitTime: z.string().describe('Best visit time of the tourist spot'),
    touristSpotHashtag: z.array(z.string()).describe('Hashtags associated with this location'),
    imageSet: ImageSetSchema.optional().describe('Image set for the tourist spot'),
    address: z.string().optional().describe('Address for enhanced search accuracy'),
});

export class TouristSpotCreateRequestDto extends createZodDto(TouristSpotCreateRequestSchema) {}
