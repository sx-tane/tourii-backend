import { Controller, Get } from '@nestjs/common';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';

/**
 * TestController provides endpoints to test various security features:
 * 1. Security Headers
 * 2. Rate Limiting
 * 3. API Key Validation
 * 4. Version Validation
 *
 * This controller helps verify that our security configurations are working correctly.
 */
@ApiTags('Security Tests')
@Controller('test')
export class TestController {
  /**
   * Test endpoint for security headers
   * - No rate limiting (using @SkipThrottle)
   * - Returns all security headers set by SecurityMiddleware
   */
  @Get('headers')
  @SkipThrottle() // This endpoint won't have rate limiting
  @ApiOperation({
    summary: 'Test Security Headers',
    description:
      'Tests the security headers set by SecurityMiddleware. Returns all configured security headers in the response.',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
  })
  @ApiHeader({
    name: 'accept-version',
    description: 'API version (e.g., 1.0.0)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Security headers test successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Check response headers',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing API key',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.type,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid version format',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_021.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_021.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_021.type,
        },
      },
    },
  })
  testHeaders() {
    return { message: 'Check response headers' };
  }

  /**
   * Test endpoint for rate limiting
   * - Limited to 3 requests per second
   * - After 3 requests, returns 429 Too Many Requests
   * - Includes rate limit headers in response:
   *   - X-RateLimit-Limit: max requests allowed
   *   - X-RateLimit-Remaining: requests remaining
   *   - X-RateLimit-Reset: time until limit resets
   */
  @Get('rate-limit')
  @Throttle({ default: { ttl: 1000, limit: 3 } }) // 3 requests per 1000ms (1 second)
  @ApiOperation({
    summary: 'Test Rate Limiting',
    description:
      'Tests the rate limiting middleware. Limited to 3 requests per second.',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
  })
  @ApiHeader({
    name: 'accept-version',
    description: 'API version (e.g., 1.0.0)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Rate limit test successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Rate limit test endpoint',
        },
      },
    },
    headers: {
      'X-RateLimit-Limit': {
        description: 'Maximum number of requests allowed',
        schema: { type: 'number' },
        example: 3,
      },
      'X-RateLimit-Remaining': {
        description: 'Number of requests remaining',
        schema: { type: 'number' },
        example: 2,
      },
      'X-RateLimit-Reset': {
        description: 'Time until rate limit resets (in seconds)',
        schema: { type: 'number' },
        example: 1,
      },
    },
  })
  @ApiResponse({
    status: 429,
    description: 'Too Many Requests',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'ThrottlerException: Too Many Requests',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing API key',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.type,
        },
      },
    },
  })
  testRateLimit() {
    return { message: 'Rate limit test endpoint' };
  }

  /**
   * Test endpoint for API key validation
   * - Requires x-api-key header
   * - Returns success if API key is valid
   */
  @Get('api-key')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Test API Key Validation',
    description: 'Tests the API key validation middleware.',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
  })
  @ApiHeader({
    name: 'accept-version',
    description: 'API version (e.g., 1.0.0)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'API key validation successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'API key is valid',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Missing API key',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.type,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid API key',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_011.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_011.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_011.type,
        },
      },
    },
  })
  testApiKey() {
    return { message: 'API key is valid' };
  }

  /**
   * Test endpoint for version validation
   * - Requires accept-version header
   * - Returns success if version is supported
   */
  @Get('version')
  @SkipThrottle()
  @ApiOperation({
    summary: 'Test Version Validation',
    description: 'Tests the API version validation middleware.',
  })
  @ApiHeader({
    name: 'x-api-key',
    description: 'API key for authentication',
    required: true,
  })
  @ApiHeader({
    name: 'accept-version',
    description: 'API version (e.g., 1.0.0)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Version validation successful',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'API version is supported',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Missing version header',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_020.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_020.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_020.type,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid version format',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_021.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_021.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_021.type,
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Unsupported version',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_022.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_022.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_022.type,
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing API key',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_010.type,
        },
      },
    },
  })
  testVersion() {
    return { message: 'API version is supported' };
  }
}
