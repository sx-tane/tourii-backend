import { ApiCreatedResponse } from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import type { ZodTypeAny } from 'zod';

export function CreatedApiResponse(schema?: ZodTypeAny) {
    return ApiCreatedResponse({
        description: 'Success',
        schema: schema ? zodToOpenAPI(schema) : undefined,
    });
}
