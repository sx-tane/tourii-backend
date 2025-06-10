import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const LocationImageSchema = z.object({
    url: z.string().describe('Direct URL to the image from Google Places Photos API'),
    width: z.number().describe('Image width in pixels'),
    height: z.number().describe('Image height in pixels'),
    photoReference: z.string().describe('Google Places photo reference ID'),
});

export const LocationInfoResponseSchema = z.object({
    name: z.string().describe('Location name from Google Places'),
    formattedAddress: z.string().optional().describe('Formatted address from Google Places'),
    phoneNumber: z.string().optional().describe('International phone number'),
    website: z.string().optional().describe('Website URL'),
    rating: z.number().optional().describe('Google Places rating (1-5 scale)'),
    googleMapsUrl: z.string().optional().describe('Direct Google Maps URL'),
    openingHours: z.array(z.string()).optional().describe('Opening hours for each day of the week'),
    images: z
        .array(LocationImageSchema)
        .optional()
        .describe('Thumbnail images of the location (up to 3 images, 400x400px)'),
});

export class LocationInfoResponseDto extends createZodDto(LocationInfoResponseSchema) {}
export class LocationImageDto extends createZodDto(LocationImageSchema) {}
