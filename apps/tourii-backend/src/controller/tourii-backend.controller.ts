import { UserEntity } from '@app/core/domain/user/user.entity';
import { Body, Controller, Get, HttpStatus, Param, Post, Query } from '@nestjs/common';
import {
    ApiBody,
    ApiHeader,
    ApiOperation,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { zodToOpenAPI } from 'nestjs-zod';
import { TouriiBackendService } from '../service/tourii-backend.service';
import {
    ApiDefaultBadRequestResponse,
    ApiInvalidVersionResponse,
    ApiUserExistsResponse,
    ApiUserNotFoundResponse,
} from '../support/decorators/api-error-responses.decorator';
import { CreatedApiResponse } from '../support/decorators/created.api-responses.decorator';
import {
    StoryChapterCreateRequestDto,
    StoryChapterCreateRequestSchema,
} from './model/tourii-request/create/chapter-story-create-request.model';
import {
    ModelRouteCreateRequestDto,
    ModelRouteCreateRequestSchema,
} from './model/tourii-request/create/model-route-create-request.model';
import {
    StoryCreateRequestDto,
    StoryCreateRequestSchema,
} from './model/tourii-request/create/story-create-request.model';
import {
    TouristSpotCreateRequestDto,
    TouristSpotCreateRequestSchema,
} from './model/tourii-request/create/tourist-spot-create-request.model';
import { QuestListQueryDto } from './model/tourii-request/fetch/quest-fetch-request.model';
import {
    StoryChapterUpdateRequestDto,
    StoryChapterUpdateRequestSchema,
} from './model/tourii-request/update/chapter-story-update-request.model';
import {
    StoryUpdateRequestDto,
    StoryUpdateRequestSchema,
} from './model/tourii-request/update/story-update-request.model';
import {
    StoryChapterResponseDto,
    StoryChapterResponseSchema,
} from './model/tourii-response/chapter-story-response.model';
import {
    ModelRouteResponseDto,
    ModelRouteResponseSchema,
} from './model/tourii-response/model-route-response.model';
import { QuestsResponseSchema } from './model/tourii-response/quest-response.model';
import {
    StoryResponseDto,
    StoryResponseSchema,
} from './model/tourii-response/story-response.model';
import {
    TouristSpotResponseDto,
    TouristSpotResponseSchema,
} from './model/tourii-response/tourist-spot-response.model';

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
        status: 201,
        description: 'API is healthy',
        schema: {
            type: 'string',
            example: 'OK',
        },
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
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
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async createStory(
        @Body()
        saga: StoryCreateRequestDto,
    ): Promise<StoryResponseDto> {
        return await this.touriiBackendService.createStory(saga);
    }

    @Post('/stories/create-chapter/:storyId')
    @ApiTags('Stories')
    @ApiOperation({
        summary: 'Create Story Chapter',
        description: 'Create a new story chapter.',
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
        description: 'Story Chapter creation request',
        schema: zodToOpenAPI(StoryChapterCreateRequestSchema),
    })
    @CreatedApiResponse(StoryChapterResponseSchema)
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async createStoryChapter(
        @Param('storyId')
        storyId: string,
        @Body()
        chapter: StoryChapterCreateRequestDto,
    ): Promise<StoryChapterResponseDto> {
        return await this.touriiBackendService.createStoryChapter(storyId, chapter);
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
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async updateStory(
        @Body()
        _saga: StoryUpdateRequestDto,
    ): Promise<StoryResponseDto> {
        // return await this.touriiBackendService.updateStory(saga);
        return <StoryResponseDto>{};
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
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async updateStoryChapter(
        @Body()
        _chapter: StoryChapterUpdateRequestDto,
    ): Promise<StoryChapterResponseDto> {
        // return await this.touriiBackendService.updateStoryChapter(chapter);
        return <StoryChapterResponseDto>{};
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
    @ApiDefaultBadRequestResponse()
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
    @ApiDefaultBadRequestResponse()
    async getStoryChaptersByStoryId(
        @Param('storyId')
        storyId: string,
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
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async createModelRoute(
        @Body()
        modelRoute: ModelRouteCreateRequestDto,
    ): Promise<ModelRouteResponseDto> {
        return await this.touriiBackendService.createModelRoute(modelRoute);
    }

    @Post('/routes/create-tourist-spot/:modelRouteId')
    @ApiTags('Routes')
    @ApiOperation({
        summary: 'Create Tourist Spot',
        description: 'Create a new tourist spot.',
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
        description: 'Tourist Spot creation request',
        schema: zodToOpenAPI(TouristSpotCreateRequestSchema),
    })
    @CreatedApiResponse(TouristSpotResponseSchema)
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async createTouristSpot(
        @Param('modelRouteId')
        modelRouteId: string,
        @Body()
        touristSpot: TouristSpotCreateRequestDto,
    ): Promise<TouristSpotResponseDto> {
        return await this.touriiBackendService.createTouristSpot(touristSpot, modelRouteId);
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
    @ApiDefaultBadRequestResponse()
    createUser(@Body() _user: UserEntity): Promise<void> {
        // return this.touriiBackendService.createUser(user);
        return Promise.resolve();
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
        status: 201,
        description: 'User found successfully',
        type: UserEntity,
    })
    @ApiUserNotFoundResponse()
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getUserByUserId(_userId: string): Promise<UserEntity | undefined> {
        // return await this.touriiBackendService.getUserByUserId(userId);
        return undefined;
    }

    @Get('/quests')
    @ApiTags('Quest')
    @ApiOperation({
        summary: 'Get quest with pagination',
        description: 'Get quest with pagination',
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
        description: 'Fetch quests successfully',
        schema: zodToOpenAPI(QuestsResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getQuestList(@Query() query: QuestListQueryDto) {
        return await this.touriiBackendService.fetchQuestsWithPagination(
            query.page,
            query.limit,
            query.isPremium,
            query.isUnlocked,
            query.questType,
        );
    }
}
