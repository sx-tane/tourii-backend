import { CheckInMethod } from '@prisma/client';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { MetadataFieldsSchema } from '../common/metadata-fields-response.model';

export const UserTravelLogResponseSchema = z.object({
    userTravelLogId: z.string().describe('Travel log ID'),
    userId: z.string().describe('User ID'),
    questId: z.string().describe('Quest ID'),
    taskId: z.string().describe('Task ID'),
    touristSpotId: z.string().describe('Tourist spot ID'),
    userLongitude: z.number().describe('User longitude'),
    userLatitude: z.number().describe('User latitude'),
    travelDistanceFromTarget: z.number().optional().describe('Distance from target'),
    travelDistance: z.number().describe('Travel distance'),
    qrCodeValue: z.string().optional().describe('QR code value'),
    checkInMethod: z.nativeEnum(CheckInMethod).optional().describe('Check-in method'),
    detectedFraud: z.boolean().optional().describe('Fraud detected'),
    fraudReason: z.string().optional().describe('Fraud reason'),
    ...MetadataFieldsSchema,
});

export class UserTravelLogResponseDto extends createZodDto(UserTravelLogResponseSchema) {}
