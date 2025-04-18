import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import { TouriiBackendService } from '../service/tourii-backend.service';
// biome-ignore lint/style/useImportType: <explanation>
import { UserEntity } from '@app/core/domain/user/user.entity';
// biome-ignore lint/style/useImportType: <explanation>
import {
  StorySagaCreateRequestSchema,
  StorySagaCreateRequestDto,
} from './model/tourii-request/create/story-saga-request.model';
import { zodToOpenAPI } from 'nestjs-zod';
// biome-ignore lint/style/useImportType: <explanation>
import {
  StorySagaResponseDto,
  StorySagaResponseSchema,
} from './model/tourii-response/story-saga-response.model';
import { CreatedApiResponse } from './model/decorator/created.api-response';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';

@Controller()
@ApiTags('Tourii Backend')
export class TouriiBackendController {
  constructor(private readonly touriiBackendService: TouriiBackendService) {}

  @Get('/health-check')
  @ApiTags('Health Check')
  @ApiOperation({
    summary: 'Health Check',
    description: 'Check if the API is running and accessible.',
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
    description: 'API is healthy',
    schema: {
      type: 'string',
      example: 'OK',
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
  checkHealth(): string {
    return 'OK';
  }

  @Post('/stories/create-saga')
  @ApiTags('Stories')
  @ApiOperation({
    summary: 'Create Story Saga',
    description: 'Create a new story saga with optional chapters.',
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
  @ApiBody({
    description: 'Story Saga creation request',
    schema: zodToOpenAPI(StorySagaCreateRequestSchema),
  })
  @CreatedApiResponse(StorySagaResponseSchema)
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
    description: 'Bad Request - Invalid request body or version',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_001.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_001.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_001.type,
        },
      },
    },
  })
  async createStorySaga(
    @Body() saga: StorySagaCreateRequestDto,
  ): Promise<StorySagaResponseDto> {
    return await this.touriiBackendService.createStorySaga(saga);
  }

  @Get('/stories/sagas')
  @ApiTags('Stories')
  @ApiOperation({
    summary: 'Get All Story Sagas',
    description: 'Retrieve all available story sagas.',
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
    status: HttpStatus.OK,
    description: 'Successfully retrieved all sagas',
    schema: zodToOpenAPI(StorySagaResponseSchema),
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
  async getSagas(): Promise<StorySagaResponseDto> {
    return this.touriiBackendService.getStorySagas();
  }

  @Post('/user')
  @ApiTags('User')
  @ApiOperation({
    summary: 'Create User',
    description: 'Create a new user in the system.',
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
  @ApiBody({
    description: 'User creation request',
    type: UserEntity,
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: UserEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - User already exists',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_006.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_006.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_006.type,
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
  createUser(@Body() user: UserEntity): Promise<UserEntity> {
    return this.touriiBackendService.createUser(user);
  }

  @Get('/:userId/user')
  @ApiTags('User')
  @ApiOperation({
    summary: 'Get User by ID',
    description: 'Retrieve user information by their user ID.',
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
    description: 'User found successfully',
    type: UserEntity,
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    schema: {
      type: 'object',
      properties: {
        code: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_004.code,
        },
        message: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_004.message,
        },
        type: {
          type: 'string',
          example: TouriiBackendAppErrorType.E_TB_004.type,
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
  async getUserByUserId(
    @Param('userId') userId: string,
  ): Promise<UserEntity | undefined> {
    return await this.touriiBackendService.getUserByUserId(userId);
  }
}
