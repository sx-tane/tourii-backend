import { UserEntity } from '@app/core/domain/user/user.entity';
import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiBody,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
// biome-ignore lint/style/useImportType: <explanation>
import { TouriiBackendService } from '../service/tourii-backend.service';
import { CreatedApiResponse } from './model/decorator/created.api-response';
// biome-ignore lint/style/useImportType: <explanation>
import {
  StoryCreateRequestDto,
  StoryCreateRequestSchema,
} from './model/tourii-request/create/story-create-request.model';
// biome-ignore lint/style/useImportType: <explanation>
import {
  StoryResponseDto,
  StoryResponseSchema,
} from './model/tourii-response/story-response.model';
import { StoryChapterResponseSchema } from './model/tourii-response/chapter-story-response.model';
// biome-ignore lint/style/useImportType: <explanation>
import { StoryChapterResponseDto } from './model/tourii-response/chapter-story-response.model';
// biome-ignore lint/style/useImportType: <explanation>
import { StoryUpdateRequestDto, StoryUpdateRequestSchema } from './model/tourii-request/update/story-update-request.model';
// biome-ignore lint/style/useImportType: <explanation>
import { StoryChapterUpdateRequestDto, StoryChapterUpdateRequestSchema } from './model/tourii-request/update/chapter-story-update-request.model';
import { ApiInvalidVersionResponse, ApiDefaultBadRequestResponse, ApiUserExistsResponse, ApiUserNotFoundResponse } from '../support/decorators/api-error-responses.decorator';
// biome-ignore lint/style/useImportType: <explanation>
import { ModelRouteCreateRequestDto } from './model/tourii-request/create/model-route-create-request.model';
import { ModelRouteCreateRequestSchema } from './model/tourii-request/create/model-route-create-request.model';
import { ModelRouteResponseSchema, ModelRouteResponseDto } from './model/tourii-response/model-route-response.model';

@Controller()
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
  @ApiUnauthorizedResponse()
  @ApiInvalidVersionResponse()
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
  @ApiUnauthorizedResponse()
  @ApiDefaultBadRequestResponse()
  async createStory(
    @Body() saga: StoryCreateRequestDto,
  ): Promise<StoryResponseDto> {
    return await this.touriiBackendService.createStory(saga);
  }

  @Post('/stories/update-saga')
  @ApiTags('Stories')
  @ApiOperation({
    summary: 'Update Story Saga',
    description: 'Update an existing story saga.',
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
    description: 'Story Saga update request',
    schema: zodToOpenAPI(StoryUpdateRequestSchema),
  })
  @CreatedApiResponse(StoryResponseSchema)
  @ApiUnauthorizedResponse()
  @ApiDefaultBadRequestResponse()
  async updateStory(
    @Body() saga: StoryUpdateRequestDto,
  ): Promise<StoryResponseDto> {
    return await this.touriiBackendService.updateStory(saga);
  }

  @Post('/stories/update-chapter')
  @ApiTags('Stories')
  @ApiOperation({
    summary: 'Update Story Chapter',
    description: 'Update an existing story chapter.',
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
    description: 'Story Chapter update request',
    schema: zodToOpenAPI(StoryChapterUpdateRequestSchema),
  })
  @CreatedApiResponse(StoryChapterResponseSchema)
  @ApiUnauthorizedResponse()
  @ApiDefaultBadRequestResponse()
  async updateStoryChapter(
    @Body() chapter: StoryChapterUpdateRequestDto,
  ): Promise<StoryChapterResponseDto> {
    return await this.touriiBackendService.updateStoryChapter(chapter);
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
  @ApiUnauthorizedResponse()
  @ApiInvalidVersionResponse()
  async getSagas(): Promise<StoryResponseDto[]> {
    return await this.touriiBackendService.getStories();
  }

  @Get('/stories/sagas/:storyId/chapters')
  @ApiTags('Stories')
  @ApiOperation({
    summary: 'Get Story Chapters',
    description: 'Retrieve all chapters for a specific story.',
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
    description: 'Successfully retrieved all chapters for a specific story.',
    schema: zodToOpenAPI(StoryChapterResponseSchema),
  })
  @ApiUnauthorizedResponse()
  @ApiInvalidVersionResponse()
  async getStoryChapters(
    @Param('storyId') storyId: string,
  ): Promise<StoryChapterResponseDto[]> {
    return await this.touriiBackendService.getStoryChapters(storyId);
  }

  @Post('/routes/create-model-route')
  @ApiTags('Routes')
  @ApiOperation({
    summary: 'Create Model Route',
    description: 'Create a new model route.',
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
    description: 'Model Route creation request',
    schema: zodToOpenAPI(ModelRouteCreateRequestSchema),
  })
  @CreatedApiResponse(ModelRouteResponseSchema)
  @ApiUnauthorizedResponse()
  @ApiDefaultBadRequestResponse()
  async createModelRoute(
    @Body() modelRoute: ModelRouteCreateRequestDto,
  ): Promise<ModelRouteResponseDto> {
    return await this.touriiBackendService.createModelRoute(modelRoute);
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
  @ApiUserExistsResponse()
  @ApiUnauthorizedResponse()
  @ApiInvalidVersionResponse()
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
  @ApiUserNotFoundResponse()
  @ApiUnauthorizedResponse()
  @ApiInvalidVersionResponse()
  async getUserByUserId(
    @Param('userId') userId: string,
  ): Promise<UserEntity | undefined> {
    return await this.touriiBackendService.getUserByUserId(userId);
  }
}
