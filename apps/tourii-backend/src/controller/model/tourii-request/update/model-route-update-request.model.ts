import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { ModelRouteCreateRequestSchema } from '../create/model-route-create-request.model';
import { ModelRouteCreateOnlyRequestSchema } from '../create/model-route-create-request.model';

export const ModelRouteUpdateRequestSchema =
    ModelRouteCreateRequestSchema.extend({
        modelRouteId: z
            .string()
            .describe('Unique identifier for the model route'),
        delFlag: z
            .boolean()
            .describe('Flag to indicate if the model route is deleted'),
        updUserId: z
            .string()
            .describe(
                'Unique identifier for the user who updated the model route',
            ),
    });

export const ModelRouteUpdateOnlyRequestSchema =
    ModelRouteCreateOnlyRequestSchema.extend({
        modelRouteId: z
            .string()
            .describe('Unique identifier for the model route'),
        delFlag: z
            .boolean()
            .describe('Flag to indicate if the model route is deleted'),
        updUserId: z
            .string()
            .describe(
                'Unique identifier for the user who updated the model route',
            ),
    });

export class ModelRouteUpdateRequestDto extends createZodDto(
    ModelRouteUpdateRequestSchema,
) {}
