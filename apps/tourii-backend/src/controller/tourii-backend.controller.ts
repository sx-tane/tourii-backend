import { UserEntity } from '@app/core/domain/user/user.entity';
import { TouriiBackendAppErrorType } from '@app/core/support/exception/tourii-backend-app-error-type';
import { TouriiBackendAppException } from '@app/core/support/exception/tourii-backend-app-exception';
import {
    Body,
    Controller,
    Delete,
    Get,
    Headers,
    HttpStatus,
    Param,
    ParseFloatPipe,
    Post,
    Query,
    Req,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
    ApiBody,
    ApiConsumes,
    ApiExtraModels,
    ApiHeader,
    ApiOperation,
    ApiQuery,
    ApiResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { QuestType, StoryStatus } from '@prisma/client';
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
import {
    LocalInteractionSubmissionDto,
    LocalInteractionSubmissionSchema,
} from './model/tourii-request/create/local-interaction-request.model';
import { LoginRequestDto } from './model/tourii-request/create/login-request.model';
import {
    ModelRouteCreateRequestDto,
    ModelRouteCreateRequestSchema,
} from './model/tourii-request/create/model-route-create-request.model';
import {
    QrScanRequestDto,
    QrScanRequestSchema,
} from './model/tourii-request/create/qr-scan-request.model';
import {
    QuestCreateRequestDto,
    QuestCreateRequestSchema,
} from './model/tourii-request/create/quest-create-request.model';
import {
    QuestTaskCreateRequestDto,
    QuestTaskCreateRequestSchema,
} from './model/tourii-request/create/quest-task-create-request.model';
import {
    QuestTaskSocialShareRequestDto,
    questTaskSocialShareRequestSchema,
} from './model/tourii-request/create/quest-task-social-share-request.model';
import {
    StoryActionRequestDto,
    StoryActionRequestSchema,
} from './model/tourii-request/create/story-action-request.model';
import {
    StoryCreateRequestDto,
    StoryCreateRequestSchema,
} from './model/tourii-request/create/story-create-request.model';
import { StoryReadingCompleteRequestDto } from './model/tourii-request/create/story-reading-complete-request.model';
import { StoryReadingStartRequestDto } from './model/tourii-request/create/story-reading-start-request.model';
import {
    TouristSpotCreateRequestDto,
    TouristSpotCreateRequestSchema,
} from './model/tourii-request/create/tourist-spot-create-request.model';
import { CheckinsFetchRequestDto } from './model/tourii-request/fetch/checkins-fetch-request.model';
import { LocationQueryDto } from './model/tourii-request/fetch/location-query-request.model';
import { MomentListQueryDto } from './model/tourii-request/fetch/moment-fetch-request.model';
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
    StartGroupQuestRequestDto,
    StartGroupQuestRequestSchema,
} from './model/tourii-request/update/start-group-quest-request.model';
import {
    StoryUpdateRequestDto,
    StoryUpdateRequestSchema,
} from './model/tourii-request/update/story-update-request.model';
import {
    SubmitAnswerTextRequestTaskDto,
    SubmitAnswerTextTaskRequestSchema,
    SubmitCheckInTaskRequestDto,
    SubmitCheckInTaskRequestSchema,
    SubmitSelectOptionsTaskRequestDto,
    SubmitSelectOptionTaskRequestSchema,
} from './model/tourii-request/update/submit-tasks-request.model';
import {
    TouristSpotUpdateRequestDto,
    TouristSpotUpdateRequestSchema,
} from './model/tourii-request/update/tourist-spot-update-request.model';
import { VerifySubmissionRequestDto } from './model/tourii-request/update/verify-submission-request.model';
import {
    AdminUserListResponseDto,
    AdminUserListResponseSchema,
    AdminUserQueryDto,
} from './model/tourii-response/admin/admin-user-list-response.model';
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
    HomepageHighlightsResponseDto,
    HomepageHighlightsResponseSchema,
} from './model/tourii-response/homepage/highlight-response.model';
import {
    LocalInteractionResponseDto,
    LocalInteractionResponseSchema,
} from './model/tourii-response/local-interaction-response.model';
import {
    LocationInfoResponseDto,
    LocationInfoResponseSchema,
} from './model/tourii-response/location-info-response.model';
import {
    ModelRouteResponseDto,
    ModelRouteResponseSchema,
} from './model/tourii-response/model-route-response.model';
import {
    MomentListResponseDto,
    MomentListResponseSchema,
    MomentResponseDto,
} from './model/tourii-response/moment-response.model';
import {
    QrScanResponseDto,
    QrScanResponseSchema,
} from './model/tourii-response/qr-scan-response.model';
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
    QuestTaskPhotoUploadResponseDto,
    QuestTaskPhotoUploadResponseSchema,
} from './model/tourii-response/quest-task-photo-upload-response.model';
import {
    QuestTaskSocialShareResponseDto,
    QuestTaskSocialShareResponseSchema,
} from './model/tourii-response/quest-task-social-share-response.model';
import {
    StartGroupQuestResponseDto,
    StartGroupQuestResponseSchema,
} from './model/tourii-response/start-group-quest-response.model';
import {
    StoryCompletionResponseDto,
    StoryCompletionResponseSchema,
} from './model/tourii-response/story-completion-response.model';
import {
    StoryProgressResponseDto,
    StoryProgressResponseSchema,
} from './model/tourii-response/story-progress-response.model';
import {
    StoryResponseDto,
    StoryResponseSchema,
} from './model/tourii-response/story-response.model';
import {
    SubmitTaskResponseDto,
    SubmitTaskResponseSchema,
} from './model/tourii-response/submit-tasks-response.model';
import {
    TouristSpotResponseDto,
    TouristSpotResponseSchema,
} from './model/tourii-response/tourist-spot-response.model';
import {
    UserResponseDto,
    UserResponseSchema,
    UserSensitiveInfoResponseDto,
    UserSensitiveInfoResponseSchema,
} from './model/tourii-response/user/user-response.model';
import {
    UserTravelLogListResponseDto,
    UserTravelLogListResponseSchema,
} from './model/tourii-response/user/user-travel-log-list-response.model';

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
    StoryReadingStartRequestDto,
    StoryReadingCompleteRequestDto,
    StoryResponseDto,
    StoryChapterResponseDto,
    StoryCompletionResponseDto,
    StoryProgressResponseDto,
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
    LocationInfoResponseDto,
    MomentListResponseDto,
    MomentResponseDto,
    UserResponseDto,
    UserTravelLogListResponseDto,
    CheckinsFetchRequestDto,
    QuestTaskPhotoUploadResponseDto,
    QrScanRequestDto,
    QrScanResponseDto,
    HomepageHighlightsResponseDto,
    AdminUserListResponseDto,
    AdminUserQueryDto,
    LocalInteractionSubmissionDto,
    LocalInteractionResponseDto,
    VerifySubmissionRequestDto,
)
export class TouriiBackendController {
    constructor(private readonly touriiBackendService: TouriiBackendService) {}

    // ==========================================
    // HELPER ENDPOINTS
    // ==========================================

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

    // ==========================================
    // USER & AUTH ENDPOINTS
    // ==========================================

    @Get('/user/sensitive-info')
    @ApiTags('User')
    @ApiOperation({
        summary: 'Get user sensitive info',
        description: 'Get user sensitive info',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({
        status: 200,
        description: 'User sensitive info',
        type: UserSensitiveInfoResponseDto,
        schema: zodToOpenAPI(UserSensitiveInfoResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getUserSensitiveInfo(@Req() req: Request): Promise<UserSensitiveInfoResponseDto> {
        //TODO: add more auth check
        return this.touriiBackendService.getUserSensitiveInfo(req.headers['x-user-id'] as string);
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
    @ApiOperation({
        summary: 'User signup with wallet',
        description: 'Create user account using wallet signature verification.',
    })
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

    @Get('/user/me')
    @ApiTags('User')
    @ApiOperation({
        summary: "Get current user's profile with optional dashboard stats",
        description: "Retrieve authenticated user's profile information with optional dashboard statistics for enhanced user experience.",
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiQuery({
        name: 'include',
        required: false,
        type: String,
        description: 'Include additional data: "stats" for dashboard statistics',
    })
    // TODO: Replace header-based userId retrieval with proper auth guard
    @ApiResponse({
        status: 200,
        description: 'Current user profile with optional dashboard statistics',
        type: UserResponseDto,
        schema: zodToOpenAPI(UserResponseSchema),
    })
    @ApiDefaultBadRequestResponse()
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiUserNotFoundResponse()
    async me(@Req() req: Request, @Query('include') include?: string): Promise<UserResponseDto> {
        const userId = req.headers['x-user-id'] as string; // TODO: extract from auth token

        if (!userId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        const includeStats = include?.includes('stats') || false;
        return this.touriiBackendService.getUserProfile(userId, includeStats);
    }

    @Get('/checkins')
    @ApiTags('User')
    @ApiOperation({
        summary: 'Get User Travel Checkins',
        description:
            'Retrieve user travel checkin history with location coordinates for map rendering. Supports pagination and filtering by quest, tourist spot, and date range.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Items per page (default: 20, max: 100)',
    })
    @ApiQuery({
        name: 'userId',
        required: false,
        type: String,
        description: 'Filter by specific user ID (admin only)',
    })
    @ApiQuery({
        name: 'questId',
        required: false,
        type: String,
        description: 'Filter by specific quest ID',
    })
    @ApiQuery({
        name: 'touristSpotId',
        required: false,
        type: String,
        description: 'Filter by specific tourist spot ID',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Filter from date (ISO format)',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Filter to date (ISO format)',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'User travel checkins retrieved successfully',
        type: UserTravelLogListResponseDto,
        schema: zodToOpenAPI(UserTravelLogListResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getCheckins(
        @Query() query: CheckinsFetchRequestDto,
        @Req() req: Request,
    ): Promise<UserTravelLogListResponseDto> {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }
        return this.touriiBackendService.getUserCheckins(query, userId);
    }

    @Get('/admin/users')
    @ApiTags('Admin')
    @ApiOperation({
        summary: 'Get all users with pagination and filtering (Admin only)',
        description:
            'Retrieve all users with comprehensive details, pagination, and advanced filtering options for admin dashboard.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Users per page (default: 20, max: 100)',
    })
    @ApiQuery({
        name: 'searchTerm',
        required: false,
        type: String,
        description: 'Search in username, email, discord/twitter usernames',
    })
    @ApiQuery({
        name: 'role',
        required: false,
        enum: ['USER', 'MODERATOR', 'ADMIN'],
        description: 'Filter by user role',
    })
    @ApiQuery({
        name: 'isPremium',
        required: false,
        type: String,
        description: 'Filter by premium status (true/false)',
    })
    @ApiQuery({
        name: 'isBanned',
        required: false,
        type: String,
        description: 'Filter by banned status (true/false)',
    })
    @ApiQuery({
        name: 'startDate',
        required: false,
        type: String,
        description: 'Filter by registration start date (ISO format)',
    })
    @ApiQuery({
        name: 'endDate',
        required: false,
        type: String,
        description: 'Filter by registration end date (ISO format)',
    })
    @ApiQuery({
        name: 'sortBy',
        required: false,
        enum: ['username', 'registered_at', 'total_quest_completed', 'total_travel_distance'],
        description: 'Sort field (default: registered_at)',
    })
    @ApiQuery({
        name: 'sortOrder',
        required: false,
        enum: ['asc', 'desc'],
        description: 'Sort order (default: desc)',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'All users retrieved successfully with pagination and filtering',
        type: AdminUserListResponseDto,
        schema: zodToOpenAPI(AdminUserListResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getAllUsersForAdmin(
        @Query() query: AdminUserQueryDto,
        @Req() req: Request,
    ): Promise<AdminUserListResponseDto> {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        return this.touriiBackendService.getAllUsersForAdmin(query);
    }

    @Get('/admin/pending-submissions')
    @ApiTags('Admin')
    @ApiOperation({
        summary: 'Get pending task submissions for manual verification (Admin only)',
        description:
            'Retrieve photo upload, social share, and text answer submissions awaiting admin approval.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiQuery({
        name: 'page',
        required: false,
        type: Number,
        description: 'Page number (default: 1)',
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        type: Number,
        description: 'Submissions per page (default: 20, max: 100)',
    })
    @ApiQuery({
        name: 'taskType',
        required: false,
        enum: ['PHOTO_UPLOAD', 'SHARE_SOCIAL', 'ANSWER_TEXT', 'LOCAL_INTERACTION'],
        description: 'Filter by task type',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Pending submissions retrieved successfully',
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getPendingSubmissions(
        @Query('page') page: number = 1,
        @Query('limit') limit: number = 20,
        @Query('taskType') taskType:
            | 'PHOTO_UPLOAD'
            | 'SHARE_SOCIAL'
            | 'ANSWER_TEXT'
            | 'LOCAL_INTERACTION'
            | undefined,
        @Req() req: Request,
    ) {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        return this.touriiBackendService.getPendingSubmissions({
            page: Math.max(1, page),
            limit: Math.min(100, Math.max(1, limit)),
            taskType,
        });
    }

    @Post('/admin/submissions/:id/verify')
    @ApiTags('Admin')
    @ApiOperation({
        summary: 'Manually approve or reject task submission (Admin only)',
        description:
            'Admin endpoint to approve or reject pending photo/social share/text answer submissions.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiBody({
        description: 'Submission verification request',
        type: VerifySubmissionRequestDto,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Submission verification completed',
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async verifySubmission(
        @Param('id') userTaskLogId: string,
        @Body() body: VerifySubmissionRequestDto,
        @Req() req: Request,
    ) {
        const adminUserId = req.headers['x-user-id'] as string;
        if (!adminUserId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        return this.touriiBackendService.verifyTaskSubmission(
            userTaskLogId,
            body.action,
            adminUserId,
            body.rejectionReason,
        );
    }

    // ==========================================
    // STORY ENDPOINTS
    // ==========================================

    @Post('/stories')
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

    @Post('/stories/:storyId/chapters')
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
        await this.touriiBackendService.trackChapterProgress(
            body.userId,
            chapterId,
            body.status,
            body.latitude,
            body.longitude,
        );
        return { success: true };
    }

    @Post('/stories/chapters/:chapterId/action')
    @Get('/stories/chapters/:chapterId/action')
    @ApiTags('Stories')
    @ApiOperation({
        summary: 'Consolidated story action endpoint',
        description:
            'Handles story start, complete, and progress actions based on X-Story-Action header',
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
    @ApiHeader({
        name: 'X-Story-Action',
        description: 'Story action to perform: start, complete, or progress',
        required: true,
        enum: ['start', 'complete', 'progress'],
    })
    @ApiBody({
        description: 'Story action request (required for start/complete, optional for progress)',
        schema: zodToOpenAPI(StoryActionRequestSchema),
        required: false,
    })
    @ApiQuery({
        name: 'userId',
        description: 'User ID (used for progress action when body is not provided)',
        required: false,
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Story action completed successfully',
        schema: {
            oneOf: [
                {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                    },
                },
                zodToOpenAPI(StoryCompletionResponseSchema),
                zodToOpenAPI(StoryProgressResponseSchema),
            ],
        },
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async handleStoryAction(
        @Param('chapterId') chapterId: string,
        @Headers('X-Story-Action') action: string,
        @Body() body?: StoryActionRequestDto,
        @Query('userId') queryUserId?: string,
    ): Promise<
        | { success: boolean; message: string }
        | StoryCompletionResponseDto
        | StoryProgressResponseDto
    > {
        // Validate action header
        if (!action || !['start', 'complete', 'progress'].includes(action)) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        // Determine userId from body or query parameter
        const userId = body?.userId || queryUserId;
        if (!userId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        switch (action) {
            case 'start':
                await this.touriiBackendService.startStoryReading(userId, chapterId);
                return { success: true, message: 'Story reading started successfully' };

            case 'complete': {
                const result = await this.touriiBackendService.completeStoryWithQuestUnlocking(
                    userId,
                    chapterId,
                );
                return {
                    success: true,
                    message: 'Story completed successfully',
                    storyProgress: result.chapter,
                    unlockedQuests: result.unlockedQuests,
                    rewards: result.rewards,
                };
            }

            case 'progress': {
                const progress = await this.touriiBackendService.getStoryProgress(
                    userId,
                    chapterId,
                );

                if (!progress) {
                    return {
                        storyChapterId: chapterId,
                        status: StoryStatus.UNREAD,
                        unlockedAt: null,
                        finishedAt: null,
                        canStart: true,
                        canComplete: false,
                    };
                }

                return {
                    storyChapterId: chapterId,
                    ...progress,
                };
            }

            default:
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }
    }

    // ==========================================
    // MODEL ROUTE ENDPOINTS
    // ==========================================

    @Post('/routes')
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

    @Post('/routes/:routeId/tourist-spots')
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
        @Param('routeId')
        routeId: string,
        @Body()
        touristSpot: TouristSpotCreateRequestDto,
    ): Promise<TouristSpotResponseDto> {
        return await this.touriiBackendService.createTouristSpot(touristSpot, routeId);
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

    @Delete('/routes/:routeId')
    @ApiTags('Routes')
    @ApiOperation({ summary: 'Delete Model Route', description: 'Delete an existing model route.' })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Model route deleted' })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async deleteModelRoute(@Param('routeId') routeId: string): Promise<void> {
        await this.touriiBackendService.deleteModelRoute(routeId);
    }

    @Delete('/routes/tourist-spots/:touristSpotId')
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

    @Get('/routes/tourist-spots/:storyChapterId')
    @ApiTags('Routes')
    @ApiOperation({
        summary: 'Get Tourist Spots by Story Chapter',
        description: 'Retrieve tourist spot information linked to a story chapter.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved tourist spots',
        type: TouristSpotResponseDto,
        isArray: true,
        schema: { type: 'array', items: zodToOpenAPI(TouristSpotResponseSchema) },
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getTouristSpotsByChapterId(
        @Param('storyChapterId') storyChapterId: string,
    ): Promise<TouristSpotResponseDto[]> {
        return this.touriiBackendService.getTouristSpotsByStoryChapterId(storyChapterId);
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

    @Get('/locations/info')
    @ApiTags('Routes')
    @ApiOperation({
        summary: 'Get Location Info',
        description: 'Retrieve basic location details with thumbnail images using Google Places.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved location info with images',
        type: LocationInfoResponseDto,
        schema: zodToOpenAPI(LocationInfoResponseSchema),
    })
    @ApiQuery({
        name: 'query',
        required: true,
        type: String,
        description: 'Place name or search query',
    })
    @ApiQuery({
        name: 'latitude',
        required: false,
        type: String,
        description: 'Latitude for location bias',
    })
    @ApiQuery({
        name: 'longitude',
        required: false,
        type: String,
        description: 'Longitude for location bias',
    })
    @ApiQuery({
        name: 'address',
        required: false,
        type: String,
        description: 'Address for enhanced search accuracy',
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getLocationInfo(
        @Query() queryParams: LocationQueryDto,
    ): Promise<LocationInfoResponseDto> {
        return this.touriiBackendService.getLocationInfo(
            queryParams.query,
            queryParams.latitude ? Number(queryParams.latitude) : undefined,
            queryParams.longitude ? Number(queryParams.longitude) : undefined,
            queryParams.address,
        );
    }

    // ==========================================
    // QUEST ENDPOINTS
    // ==========================================

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
    @ApiQuery({
        name: 'userId',
        required: false,
        type: String,
        description: 'User ID',
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
        const { page, limit, isPremium, isUnlocked, questType, userId } = query;
        return await this.touriiBackendService.fetchQuestsWithPagination(
            Number(page),
            Number(limit),
            isPremium === undefined ? undefined : Boolean(isPremium),
            isUnlocked === undefined ? undefined : Boolean(isUnlocked),
            questType,
            userId,
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
    @ApiQuery({
        name: 'userId',
        required: false,
        type: String,
        description: 'User ID',
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
        @Query('userId')
        userId: string,
    ): Promise<QuestResponseDto> {
        return await this.touriiBackendService.getQuestById(questId, userId);
    }

    @Get('/quests/tourist-spot/:touristSpotId')
    @ApiTags('Quest')
    @ApiOperation({
        summary: 'Get Quests by Tourist Spot',
        description:
            'Retrieve quests linked to a tourist spot. Provide a userId to include completion status.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiQuery({ name: 'userId', required: false, type: String, description: 'User ID' })
    @ApiQuery({
        name: 'latitude',
        required: false,
        type: Number,
        description: 'Latitude for location tracking',
    })
    @ApiQuery({
        name: 'longitude',
        required: false,
        type: Number,
        description: 'Longitude for location tracking',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Quests found successfully',
        type: QuestResponseDto,
        isArray: true,
        schema: { type: 'array', items: zodToOpenAPI(QuestResponseSchema) },
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getQuestByTouristSpotId(
        @Param('touristSpotId') touristSpotId: string,
        @Query('userId') userId?: string,
        @Query('latitude', new ParseFloatPipe({ optional: true })) latitude?: number,
        @Query('longitude', new ParseFloatPipe({ optional: true })) longitude?: number,
    ): Promise<QuestResponseDto[]> {
        return this.touriiBackendService.getQuestsByTouristSpotId(
            touristSpotId,
            userId,
            latitude,
            longitude,
        );
    }

    @Post('/quests')
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

    @Post('/quests/:questId/tasks')
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

    @Delete('/tasks/:taskId')
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
    @ApiTags('Quest')
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
    @ApiTags('Quest')
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
        return this.touriiBackendService.startGroupQuest(
            questId,
            body.userId,
            body.latitude,
            body.longitude,
        );
    }

    @Post('/tasks/:taskId/photo-upload')
    @UseInterceptors(
        FileInterceptor('file', {
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB limit
                files: 1,
            },
            fileFilter: (_req, file, cb) => {
                // Only allow image files
                if (!file.mimetype.match(/^image\/(jpeg|jpg|png|webp)$/)) {
                    return cb(new Error('Only JPEG, PNG, and WebP image files are allowed'), false);
                }
                cb(null, true);
            },
        }),
    )
    @ApiTags('Task')
    @ApiOperation({
        summary: 'Upload task photo',
        description: 'Upload photo for photo submission task completion.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Photo upload payload',
        schema: { type: 'object', properties: { file: { type: 'string', format: 'binary' } } },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Photo submitted successfully',
        type: QuestTaskPhotoUploadResponseDto,
        schema: zodToOpenAPI(QuestTaskPhotoUploadResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async uploadTaskPhoto(
        @Param('taskId') taskId: string,
        @UploadedFile() file: { buffer: Buffer; mimetype: string },
        @Req() req: Request,
    ): Promise<QuestTaskPhotoUploadResponseDto> {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        if (!file || !file.buffer) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        return this.touriiBackendService.uploadQuestTaskPhoto(taskId, userId, {
            buffer: file.buffer,
            mimetype: file.mimetype,
        });
    }

    @Post('/tasks/:taskId/social-share')
    @ApiTags('Task')
    @ApiOperation({
        summary: 'Complete social sharing task',
        description: 'Submit social media proof URL for task completion.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiBody({
        description: 'Social share proof URL',
        schema: zodToOpenAPI(questTaskSocialShareRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Social share recorded successfully',
        type: QuestTaskSocialShareResponseDto,
        schema: zodToOpenAPI(QuestTaskSocialShareResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async completeSocialShareTask(
        @Param('taskId') taskId: string,
        @Body() body: QuestTaskSocialShareRequestDto,
        @Req() req: Request,
    ): Promise<QuestTaskSocialShareResponseDto> {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }
        return this.touriiBackendService.completeSocialShareTask(
            taskId,
            userId,
            body.proofUrl,
            body.latitude,
            body.longitude,
        );
    }

    @Post('/tasks/:taskId/qr-scan')
    @ApiTags('Task')
    @ApiOperation({
        summary: 'Complete QR scan task',
        description: 'Validate scanned QR code and complete the task if correct',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiBody({
        description: 'QR scan request',
        schema: zodToOpenAPI(QrScanRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'QR code validated and task completed',
        type: QrScanResponseDto,
        schema: zodToOpenAPI(QrScanResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async completeQrScanTask(
        @Param('taskId') taskId: string,
        @Body() body: QrScanRequestDto,
        @Req() req: Request,
    ): Promise<QrScanResponseDto> {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        return this.touriiBackendService.completeQrScanTask(
            taskId,
            userId,
            body.code,
            body.latitude,
            body.longitude,
        );
    }

    @Post('/tasks/:taskId/answer-text')
    @ApiTags('Task')
    @ApiOperation({
        summary: 'Submit answer text task',
        description: 'Submit text answer for text-based task completion.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiBody({
        description: 'Submit answer text task request',
        type: SubmitAnswerTextRequestTaskDto,
        schema: zodToOpenAPI(SubmitAnswerTextTaskRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Submit answer text task successfully',
        type: SubmitTaskResponseDto,
        schema: zodToOpenAPI(SubmitTaskResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async submitAnswerTextTask(
        @Param('taskId') taskId: string,
        @Body() payload: SubmitAnswerTextRequestTaskDto,
        @Req() req: Request,
    ): Promise<SubmitTaskResponseDto> {
        const { answer } = payload;
        const userId = req.headers['x-user-id'] as string;
        return await this.touriiBackendService.submitAnswerTextTask(taskId, answer, userId);
    }

    @Post('/tasks/:taskId/select-option')
    @ApiTags('Task')
    @ApiOperation({
        summary: 'Submit select option task',
        description: 'Submit selected options for multiple choice task completion.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiBody({
        description: 'Submit select option task request',
        type: SubmitSelectOptionsTaskRequestDto,
        schema: zodToOpenAPI(SubmitSelectOptionTaskRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Submit select option task successfully',
        type: SubmitTaskResponseDto,
        schema: zodToOpenAPI(SubmitTaskResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async submitSelectOptionTask(
        @Param('taskId') taskId: string,
        @Body() payload: SubmitSelectOptionsTaskRequestDto,
        @Req() req: Request,
    ): Promise<SubmitTaskResponseDto> {
        const { selectedOptionIds } = payload;
        const userId = req.headers['x-user-id'] as string;
        return await this.touriiBackendService.submitSelectOptionTask(
            taskId,
            selectedOptionIds,
            userId,
        );
    }

    @Post('/tasks/:taskId/checkin')
    @ApiTags('Task')
    @ApiOperation({
        summary: 'Submit checkin task',
        description: 'Submit location coordinates for check-in task completion.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiBody({
        description: 'Submit checkin task request',
        type: SubmitCheckInTaskRequestDto,
        schema: zodToOpenAPI(SubmitCheckInTaskRequestSchema),
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Submit checkin task successfully',
        type: SubmitTaskResponseDto,
        schema: zodToOpenAPI(SubmitTaskResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async submitCheckInTask(
        @Param('taskId') taskId: string,
        @Body() payload: SubmitCheckInTaskRequestDto,
        @Req() req: Request,
    ): Promise<SubmitTaskResponseDto> {
        const { longitude, latitude } = payload;
        const userId = req.headers['x-user-id'] as string;
        return await this.touriiBackendService.submitCheckInTask(
            taskId,
            longitude,
            latitude,
            userId,
        );
    }

    @Post('/tasks/:taskId/local-interaction')
    @ApiTags('Task')
    @ApiOperation({
        summary: 'Submit local interaction task',
        description:
            'Submit text, photo, or audio content for local interaction tasks. Supports both JSON (with base64) and multipart file uploads.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiHeader({ name: 'x-user-id', description: 'User ID for authentication', required: true })
    @ApiConsumes('application/json', 'multipart/form-data')
    @ApiBody({
        description:
            'Local interaction submission - supports JSON with base64 or multipart file upload',
        schema: {
            oneOf: [
                zodToOpenAPI(LocalInteractionSubmissionSchema),
                {
                    type: 'object',
                    properties: {
                        interactionType: {
                            type: 'string',
                            enum: ['text', 'photo', 'audio'],
                            description: 'Type of interaction content',
                        },
                        content: {
                            type: 'string',
                            description: 'Text content (for text type)',
                        },
                        file: {
                            type: 'string',
                            format: 'binary',
                            description: 'Photo or audio file (for photo/audio types)',
                        },
                        latitude: {
                            type: 'number',
                            description: 'Optional latitude for anti-cheat verification',
                        },
                        longitude: {
                            type: 'number',
                            description: 'Optional longitude for anti-cheat verification',
                        },
                    },
                    required: ['interactionType'],
                },
            ],
        },
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Local interaction submitted successfully',
        type: LocalInteractionResponseDto,
        schema: zodToOpenAPI(LocalInteractionResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    @UseInterceptors(FileInterceptor('file'))
    async submitLocalInteraction(
        @Param('taskId') taskId: string,
        @Body() body: any,
        @UploadedFile() file: any,
        @Req() req: Request,
    ): Promise<LocalInteractionResponseDto> {
        const userId = req.headers['x-user-id'] as string;
        if (!userId) {
            throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
        }

        const contentType = req.headers['content-type'] || '';
        let submission: LocalInteractionSubmissionDto;

        // Handle multipart/form-data (file upload)
        if (contentType.includes('multipart/form-data')) {
            if (!file && body.interactionType !== 'text') {
                throw new TouriiBackendAppException(TouriiBackendAppErrorType.E_TB_001);
            }

            if (body.interactionType === 'text') {
                // Text submission via multipart
                submission = {
                    interactionType: 'text',
                    content: body.content || '',
                    latitude: body.latitude ? parseFloat(body.latitude) : undefined,
                    longitude: body.longitude ? parseFloat(body.longitude) : undefined,
                };
            } else {
                // File submission via multipart - convert to base64
                const base64Content = file.buffer.toString('base64');
                submission = {
                    interactionType: body.interactionType,
                    content: base64Content,
                    latitude: body.latitude ? parseFloat(body.latitude) : undefined,
                    longitude: body.longitude ? parseFloat(body.longitude) : undefined,
                };
            }
        } else {
            // Handle application/json (existing behavior)
            submission = body as LocalInteractionSubmissionDto;
        }

        return this.touriiBackendService.submitLocalInteractionTask(taskId, userId, submission);
    }

    // ==========================================
    // DASHBOARD ENDPOINTS
    // ==========================================

    @Get('/moments')
    @ApiTags('Moment')
    @ApiOperation({
        summary: 'Get latest moments',
        description: 'Retrieve latest traveler moments and activities.',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Fetch moments successfully',
        type: MomentListResponseDto,
        schema: zodToOpenAPI(MomentListResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getMoments(@Query() query: MomentListQueryDto): Promise<MomentListResponseDto> {
        return await this.touriiBackendService.getLatestMoments(
            Number(query.page),
            Number(query.limit),
            query.momentType,
        );
    }

    // ==========================================
    // HOMEPAGE ENDPOINTS
    // ==========================================
    @Get('/v2/homepage/highlights')
    @ApiTags('Homepage')
    @ApiOperation({
        summary: 'Get homepage highlights',
        description: 'Latest chapter and popular quest',
    })
    @ApiHeader({ name: 'x-api-key', description: 'API key for authentication', required: true })
    @ApiHeader({ name: 'accept-version', description: 'API version (e.g., 1.0.0)', required: true })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Homepage highlights',
        type: HomepageHighlightsResponseDto,
        schema: zodToOpenAPI(HomepageHighlightsResponseSchema),
    })
    @ApiUnauthorizedResponse()
    @ApiInvalidVersionResponse()
    @ApiDefaultBadRequestResponse()
    async getHomepageHighlights(): Promise<HomepageHighlightsResponseDto> {
        return this.touriiBackendService.getHomepageHighlights();
    }
}
