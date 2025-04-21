import { UserEntity } from '@app/core/domain/user/user.entity';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
// biome-ignore lint/style/useImportType: <explanation>
import { TouriiBackendService } from '../service/tourii-backend.service';
import { CreatedApiResponse } from './model/decorator/created.api-response';
// biome-ignore lint/style/useImportType: <explanation>
import {
  StoryCreateRequestDto,
  StoryCreateRequestSchema,
} from './model/tourii-request/create/story-request.model';
// biome-ignore lint/style/useImportType: <explanation>
import {
  StoryResponseDto,
  StoryResponseSchema,
} from './model/tourii-response/story-response.model';

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
    schema: zodToOpenAPI(StoryCreateRequestSchema),
  })
  @CreatedApiResponse(StoryResponseSchema)
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
  async createStory(
    @Body() saga: StoryCreateRequestDto,
  ): Promise<StoryResponseDto> {
    return await this.touriiBackendService.createStory(saga);
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
    schema: zodToOpenAPI(StoryResponseSchema),
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
  async getSagas(): Promise<StoryResponseDto[]> {
    return await this.touriiBackendService.getStories();
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
