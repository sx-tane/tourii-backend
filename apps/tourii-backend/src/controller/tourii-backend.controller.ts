import { UserEntity } from '@app/core/domain/user/user.entity';
import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Query, Req } from '@nestjs/common';
import {
    ApiBody,
    ApiExtraModels,
    ApiHeader,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { QuestType } from '@prisma/client';
import type { Request } from 'express';
import { zodToOpenAPI } from 'nestjs-zod';
import { TouriiBackendService } from '../service/tourii-backend.service';
import {
    ApiDefaultBadRequestResponse,
    ApiInvalidVersionResponse,
    ApiUserExistsResponse,
    ApiUserNotFoundResponse,
} from '../support/decorators/api-error-responses.decorator';
import {
    AuthSignupRequestDto,
    AuthSignupRequestSchema,
} from './model/tourii-request/create/auth-signup-request.model';
import {
    StoryChapterCreateRequestDto,
    StoryChapterCreateRequestSchema,
} from './model/tourii-request/create/chapter-story-create-request.model';
import { LoginRequestDto } from './model/tourii-request/create/login-request.model';
import {
    ModelRouteCreateRequestDto,
    ModelRouteCreateRequestSchema,
} from './model/tourii-request/create/model-route-create-request.model';
import {
    QuestCreateRequestDto,
    QuestCreateRequestSchema,
} from './model/tourii-request/create/quest-create-request.model';
import {
    QuestTaskCreateRequestDto,
    QuestTaskCreateRequestSchema,
} from './model/tourii-request/create/quest-task-create-request.model';
import {
    StoryCreateRequestDto,
    StoryCreateRequestSchema,
} from './model/tourii-request/create/story-create-request.model';
import {
    TouristSpotCreateRequestDto,
    TouristSpotCreateRequestSchema,
} from './model/tourii-request/create/tourist-spot-create-request.model';
import { LocationQueryDto } from './model/tourii-request/fetch/location-query-request.model';
import { QuestListQueryDto } from './model/tourii-request/fetch/quest-fetch-request.model';
import {
    ChapterProgressRequestDto,
    ChapterProgressRequestSchema,
} from './model/tourii-request/update/chapter-progress-request.model';
import {
    StoryChapterUpdateRequestDto,
    StoryChapterUpdateRequestSchema,
} from './model/tourii-request/update/chapter-story-update-request.model';
import {
    ModelRouteUpdateRequestDto,
    ModelRouteUpdateRequestSchema,
} from './model/tourii-request/update/model-route-update-request.model';
import {
    QuestTaskUpdateRequestDto,
    QuestTaskUpdateRequestSchema,
} from './model/tourii-request/update/quest-task-update-request.model';
import {
    QuestUpdateRequestDto,
    QuestUpdateRequestSchema,
} from './model/tourii-request/update/quest-update-request.model';
import {
    StoryUpdateRequestDto,
    StoryUpdateRequestSchema,
} from './model/tourii-request/update/story-update-request.model';
import {
    TouristSpotUpdateRequestDto,
    TouristSpotUpdateRequestSchema,
} from './model/tourii-request/update/tourist-spot-update-request.model';

import {
    StartGroupQuestRequestDto,
    StartGroupQuestRequestSchema,
} from './model/tourii-request/update/start-group-quest-request.model';
import {
    AuthSignupResponseDto,
    AuthSignupResponseSchema,
} from './model/tourii-response/auth-signup-response.model';
import {
    StoryChapterResponseDto,
    StoryChapterResponseSchema,
} from './model/tourii-response/chapter-story-response.model';
import {
    GroupMembersResponseDto,
    GroupMembersResponseSchema,
} from './model/tourii-response/group-members-response.model';
import {
    ModelRouteResponseDto,
    ModelRouteResponseSchema,
} from './model/tourii-response/model-route-response.model';
import {
    QuestListResponseDto,
    QuestListResponseSchema,
} from './model/tourii-response/quest-list-response.model';
import {
    QuestResponseDto,
    QuestResponseSchema,
    TaskResponseDto,
    TaskResponseSchema,
} from './model/tourii-response/quest-response.model';
import {
    StartGroupQuestResponseDto,
    StartGroupQuestResponseSchema,
} from './model/tourii-response/start-group-quest-response.model';
import {
    StoryResponseDto,
    StoryResponseSchema,
} from './model/tourii-response/story-response.model';
import {
    TouristSpotResponseDto,
    TouristSpotResponseSchema,
} from './model/tourii-response/tourist-spot-response.model';

@Controller()
@ApiExtraModels(
    StoryCreateRequestDto,
    StoryChapterCreateRequestDto,
    ModelRouteCreateRequestDto,
    TouristSpotCreateRequestDto,
    StoryUpdateRequestDto,
    StoryChapterUpdateRequestDto,
    ModelRouteUpdateRequestDto,
    TouristSpotUpdateRequestDto,
    StoryResponseDto,
    StoryChapterResponseDto,
    ModelRouteResponseDto,
    TouristSpotResponseDto,
    UserEntity,
    QuestListResponseDto,
    QuestResponseDto,
    TaskResponseDto,
    QuestCreateRequestDto,
    QuestTaskCreateRequestDto,
    QuestUpdateRequestDto,
    QuestTaskUpdateRequestDto,
    LoginRequestDto,
    AuthSignupRequestDto,
    AuthSignupResponseDto,
    GroupMembersResponseDto,
    StartGroupQuestRequestDto,
    StartGroupQuestResponseDto,
    LocationQueryDto,
)
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
        type: StoryCreateRequestDto,
        schema: zodToOpenAPI(StoryCreateRequestSchema),
    })
    @ApiResponse({
        status: 201,
        description: 'Successfully created story saga',
        type: StoryResponseDto,
        schema: zodToOpenAPI(StoryResponseSchema),
    })
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
        type: StoryChapterCreateRequestDto,
        schema: zodToOpenAPI(StoryChapterCreateRequestSchema),
    })
    @ApiResponse({
        status: 201,
        description: 'Successfully created story chapter',
        type: StoryChapterResponseDto,
        schema: zodToOpenAPI(StoryChapterResponseSchema),
    })
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
    @ApiResponse({
        status: 201,
        description: 'Successfully updated story saga',
        type: StoryResponseDto,
        schema: zodToOpenAPI(StoryResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async updateStory(
        @Body()
        saga: StoryUpdateRequestDto,
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
    @ApiResponse({
        status: 201,
        description: 'Successfully updated story chapter',
        type: StoryChapterResponseDto,
        schema: zodToOpenAPI(StoryChapterResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async updateStoryChapter(
        @Body()
        chapter: StoryChapterUpdateRequestDto,
    ): Promise<StoryChapterResponseDto> {
        return await this.touriiBackendService.updateStoryChapter(chapter);
    }

    @Delete('/stories/:storyId')
    @ApiTags('Stories')
    @ApiOperation({ summary: 'Delete Story', description: 'Delete a story saga.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Story deleted' })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async deleteStory(@Param('storyId') storyId: string): Promise<void> {
        await this.touriiBackendService.deleteStory(storyId);
    }

    @Delete('/stories/chapters/:chapterId')
    @ApiTags('Stories')
    @ApiOperation({ summary: 'Delete Story Chapter', description: 'Delete a story chapter.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Story chapter deleted' })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async deleteStoryChapter(@Param('chapterId') chapterId: string): Promise<void> {
        await this.touriiBackendService.deleteStoryChapter(chapterId);
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
        type: StoryResponseDto,
        isArray: true,
        schema: {
            type: 'array',
            items: zodToOpenAPI(StoryResponseSchema),
        },
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

    @Post('/stories/chapters/:chapterId/progress')
    @ApiTags('Stories')
    @ApiOperation({
        summary: 'Save chapter reading progress',
        description: 'Track user reading progress for a story chapter',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiBody({
        description: 'Progress request',
        schema: zodToOpenAPI(ChapterProgressRequestSchema),
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Progress recorded' })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async markChapterProgress(
        @Param('chapterId') chapterId: string,
        @Body() body: ChapterProgressRequestDto,
    ): Promise<{ success: boolean }> {
        await this.touriiBackendService.trackChapterProgress(body.userId, chapterId, body.status);
        return { success: true };
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
    @ApiResponse({
        status: 201,
        description: 'Successfully created model route',
        type: ModelRouteResponseDto,
        schema: zodToOpenAPI(ModelRouteResponseSchema),
    })
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
    @ApiResponse({
        status: 201,
        description: 'Successfully created tourist spot',
        type: TouristSpotResponseDto,
        schema: zodToOpenAPI(TouristSpotResponseSchema),
    })
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

    @Post('/routes/update-model-route')
    @ApiTags('Routes')
    @ApiOperation({ summary: 'Update Model Route', description: 'Update an existing model route.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiBody({
        description: 'Model Route update request',
        schema: zodToOpenAPI(ModelRouteUpdateRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Successfully updated model route',
        type: ModelRouteResponseDto,
        schema: zodToOpenAPI(ModelRouteResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async updateModelRoute(
        @Body() modelRoute: ModelRouteUpdateRequestDto,
    ): Promise<ModelRouteResponseDto> {
        return await this.touriiBackendService.updateModelRoute(modelRoute);
    }

    @Post('/routes/update-tourist-spot')
    @ApiTags('Routes')
    @ApiOperation({
        summary: 'Update Tourist Spot',
        description: 'Update an existing tourist spot.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiBody({
        description: 'Tourist Spot update request',
        schema: zodToOpenAPI(TouristSpotUpdateRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Successfully updated tourist spot',
        type: TouristSpotResponseDto,
        schema: zodToOpenAPI(TouristSpotResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async updateTouristSpot(
        @Body() touristSpot: TouristSpotUpdateRequestDto,
    ): Promise<TouristSpotResponseDto> {
        return await this.touriiBackendService.updateTouristSpot(touristSpot);
    }

    @Delete('/routes/:modelRouteId')
    @ApiTags('Routes')
    @ApiOperation({ summary: 'Delete Model Route', description: 'Delete an existing model route.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Model route deleted' })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async deleteModelRoute(@Param('modelRouteId') modelRouteId: string): Promise<void> {
        await this.touriiBackendService.deleteModelRoute(modelRouteId);
    }

    @Delete('/routes/tourist-spot/:touristSpotId')
    @ApiTags('Routes')
    @ApiOperation({ summary: 'Delete Tourist Spot', description: 'Delete a tourist spot.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Tourist spot deleted' })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async deleteTouristSpot(@Param('touristSpotId') touristSpotId: string): Promise<void> {
        await this.touriiBackendService.deleteTouristSpot(touristSpotId);
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
    createUser(@Body() user: UserEntity): Promise<UserEntity> {
        return this.touriiBackendService.createUser(user);
    }

    @Post('/login')
    @ApiTags('Auth')
    @ApiOperation({
        summary: 'User Login',
        description:
            'Login using username or other identifiers with optional wallet/social checks.',
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
    @ApiBody({ description: 'Login request', type: LoginRequestDto })
    @ApiResponse({ status: 201, description: 'Login successful', type: UserEntity })
    @ApiUserNotFoundResponse()
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    login(@Body() login: LoginRequestDto): Promise<UserEntity> {
        return this.touriiBackendService.loginUser(login);
    }
    @Post('/auth/signup')
    @ApiTags('Auth')
    @ApiOperation({ summary: 'User signup with wallet' })
    @ApiBody({
        description: 'Signup info',
        type: AuthSignupRequestDto,
        schema: zodToOpenAPI(AuthSignupRequestSchema),
    })
    @ApiResponse({
        status: 201,
        description: 'Signup success',
        type: AuthSignupResponseDto,
        schema: zodToOpenAPI(AuthSignupResponseSchema),
    })
    @ApiDefaultBadRequestResponse()
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiUserExistsResponse()
    async signup(
        @Body() dto: AuthSignupRequestDto,
        @Req() req: Request,
    ): Promise<AuthSignupResponseDto> {
        return this.touriiBackendService.signupUser(
            dto.email,
            dto.socialProvider,
            dto.socialId,
            req.ip ?? '',
        );
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
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number for pagination (default: 1)',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Number of quests per page (default: 20, max: 100)',
    })
    @ApiQuery({
        name: 'isPremium',
        required: false,
        type: Boolean,
        description: 'Filter by premium status',
    })
    @ApiQuery({
        name: 'isUnlocked',
        required: false,
        type: Boolean,
        description: 'Filter by unlocked status',
    })
    @ApiQuery({
        name: 'questType',
        required: false,
        enum: QuestType,
        description: 'Filter by quest type',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Fetch quests successfully',
        type: QuestListResponseDto,
        schema: zodToOpenAPI(QuestListResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getQuestList(@Query() query: QuestListQueryDto): Promise<QuestListResponseDto> {
        const { page, limit, isPremium, isUnlocked, questType } = query;
        return await this.touriiBackendService.fetchQuestsWithPagination(
            Number(page),
            Number(limit),
            isPremium === undefined ? undefined : Boolean(isPremium),
            isUnlocked === undefined ? undefined : Boolean(isUnlocked),
            questType,
        );
    }

    @Get('/quests/:questId')
    @ApiTags('Quest')
    @ApiOperation({
        summary: 'Get quest by ID',
        description: 'Get quest by ID',
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
        description: 'Quest found successfully',
        type: QuestResponseDto,
        schema: zodToOpenAPI(QuestResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getQuestById(
        @Param('questId')
        questId: string,
    ): Promise<QuestResponseDto> {
        return await this.touriiBackendService.getQuestById(questId);
    }

    @Post('/quests/create-quest')
    @ApiTags('Quest')
    @ApiOperation({ summary: 'Create Quest', description: 'Create a new quest.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiBody({
        description: 'Quest create request',
        schema: zodToOpenAPI(QuestCreateRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Successfully created quest',
        type: QuestResponseDto,
        schema: zodToOpenAPI(QuestResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async createQuest(@Body() quest: QuestCreateRequestDto): Promise<QuestResponseDto> {
        return await this.touriiBackendService.createQuest(quest);
    }

    @Post('/quests/create-task/:questId')
    @ApiTags('Quest')
    @ApiOperation({ summary: 'Create Quest Task', description: 'Create a new quest task.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiBody({
        description: 'Quest task create request',
        schema: zodToOpenAPI(QuestTaskCreateRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Successfully created quest task',
        type: TaskResponseDto,
        schema: zodToOpenAPI(TaskResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async createQuestTask(
        @Param('questId') questId: string,
        @Body() task: QuestTaskCreateRequestDto,
    ): Promise<TaskResponseDto> {
        return await this.touriiBackendService.createQuestTask(questId, task);
    }

    @Post('/quests/update-quest')
    @ApiTags('Quest')
    @ApiOperation({ summary: 'Update Quest', description: 'Update an existing quest.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiBody({
        description: 'Quest update request',
        schema: zodToOpenAPI(QuestUpdateRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Successfully updated quest',
        type: QuestResponseDto,
        schema: zodToOpenAPI(QuestResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async updateQuest(@Body() quest: QuestUpdateRequestDto): Promise<QuestResponseDto> {
        return await this.touriiBackendService.updateQuest(quest);
    }

    @Post('/quests/update-task')
    @ApiTags('Quest')
    @ApiOperation({ summary: 'Update Quest Task', description: 'Update an existing quest task.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiBody({
        description: 'Quest task update request',
        schema: zodToOpenAPI(QuestTaskUpdateRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Successfully updated quest task',
        type: TaskResponseDto,
        schema: zodToOpenAPI(TaskResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async updateQuestTask(@Body() task: QuestTaskUpdateRequestDto): Promise<TaskResponseDto> {
        return await this.touriiBackendService.updateQuestTask(task);
    }

    @Delete('/quests/:questId')
    @ApiTags('Quest')
    @ApiOperation({ summary: 'Delete Quest', description: 'Delete a quest and its tasks.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Quest deleted' })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async deleteQuest(@Param('questId') questId: string): Promise<void> {
        await this.touriiBackendService.deleteQuest(questId);
    }

    @Delete('/quests/tasks/:taskId')
    @ApiTags('Quest')
    @ApiOperation({ summary: 'Delete Quest Task', description: 'Delete an individual quest task.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Quest task deleted' })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async deleteQuestTask(@Param('taskId') taskId: string): Promise<void> {
        await this.touriiBackendService.deleteQuestTask(taskId);
    }

    @Get('/quests/:questId/group/members')
    @ApiTags('Group Quest')
    @ApiOperation({
        summary: 'Get Group Members',
        description: 'Return current members of the group quest.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Member list',
        type: GroupMembersResponseDto,
        schema: zodToOpenAPI(GroupMembersResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getGroupMembers(@Param('questId') questId: string): Promise<GroupMembersResponseDto> {
        return this.touriiBackendService.getGroupMembers(questId);
    }

    @Post('/quests/:questId/group/start')
    @ApiTags('Group Quest')
    @ApiOperation({
        summary: 'Start Group Quest',
        description: 'Leader starts the quest for all members.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiBody({
        description: 'Start group quest request',
        schema: zodToOpenAPI(StartGroupQuestRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Group quest started',
        type: StartGroupQuestResponseDto,
        schema: zodToOpenAPI(StartGroupQuestResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async startGroupQuest(
        @Param('questId') questId: string,
        @Body() body: StartGroupQuestRequestDto,
    ): Promise<StartGroupQuestResponseDto> {
        return this.touriiBackendService.startGroupQuest(questId, body.userId);
    }

    @Get('/routes')
    @ApiTags('Routes')
    @ApiOperation({
        summary: 'Get All Model Routes',
        description: 'Retrieve a list of all available model routes with their details.',
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
        description: 'Successfully retrieved all model routes',
        type: [ModelRouteResponseDto],
        schema: {
            type: 'array',
            items: zodToOpenAPI(ModelRouteResponseSchema),
        },
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getRoutes(): Promise<ModelRouteResponseDto[]> {
        return this.touriiBackendService.getModelRoutes();
    }

    @Get('/routes/:id')
    @ApiTags('Routes')
    @ApiOperation({
        summary: 'Get Model Route by ID',
        description:
            'Retrieve a specific model route by its ID, including tourist spots and weather data.',
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
        description: 'Successfully retrieved the model route',
        type: ModelRouteResponseDto,
        schema: zodToOpenAPI(ModelRouteResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getRouteById(@Param('id') id: string): Promise<ModelRouteResponseDto> {
        return this.touriiBackendService.getModelRouteById(id);
    }

    @Get('/location-info')
    @ApiTags('Location')
    @ApiOperation({
        summary: 'Get Location Info',
        description: 'Retrieve basic location details using Google Places.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved location info',
        schema: {
            type: 'object',
            properties: {
                name: { type: 'string' },
                formattedAddress: { type: 'string' },
            },
        },
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getLocationInfo(@Query() queryParams: LocationQueryDto) {
        return this.touriiBackendService.getLocationInfo(queryParams.query);
    }
}
