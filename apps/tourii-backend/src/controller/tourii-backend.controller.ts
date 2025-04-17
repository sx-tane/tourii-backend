import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
// biome-ignore lint/style/useImportType: <explanation>
import  { TouriiBackendService } from '../service/tourii-backend.service';
// biome-ignore lint/style/useImportType: <explanation>
import  { UserEntity } from '@app/core/domain/user/user.entity';
// biome-ignore lint/style/useImportType: <explanation>
import { StorySagaCreateRequestSchema,  StorySagaCreateRequestDto } from './model/tourii-request/create/story-saga-request.model';
import { zodToOpenAPI } from 'nestjs-zod';
// biome-ignore lint/style/useImportType: <explanation>
import {  StorySagaResponseDto, StorySagaResponseSchema } from './model/tourii-response/story-saga-response.model';
import { CreatedApiResponse } from './model/decorator/created.api-response';

@Controller()
export class TouriiBackendController {
  constructor(private readonly touriiBackendService: TouriiBackendService) {}

  @Get('/health-check')
  @ApiTags('Health Check')
  @ApiOperation({ summary: 'Health Check' })
  checkHealth(): string {
    return 'OK';
  }

  @Post('/stories/create-saga')
  @ApiTags('Stories')
  @ApiBody({ description: 'Create Story Saga API Request', schema: zodToOpenAPI(StorySagaCreateRequestSchema) })
  @ApiOperation({ summary: 'Create Story Saga' })
  @CreatedApiResponse(StorySagaResponseSchema)
  async createStorySaga(@Body() saga: StorySagaCreateRequestDto): Promise<StorySagaResponseDto> {
    return await this.touriiBackendService.createStorySaga(saga);
  }

  @Get('/stories/sagas')
  @ApiTags('Stories')
  @ApiOperation({ summary: 'Get All Story Sagas' })
  @CreatedApiResponse(StorySagaResponseSchema)
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  async getSagas(): Promise<StorySagaResponseDto> {
    return this.touriiBackendService.getStorySagas();
  }

  @Post('/user')
  @ApiTags('User')
  @ApiOperation({ summary: 'Create User' })
  createUser(@Body() user: UserEntity): Promise<UserEntity> {
    return this.touriiBackendService.createUser(user);
  }

  @Get('/:userId/user')
  @ApiTags('User')
  @ApiOperation({
    summary: 'Get User API',
    description: 'Get user by userId',
  })
  async getUserByUserId(@Param('userId') userId: string): Promise<any> {
    const user = await this.touriiBackendService.getUserByUserId(userId);
    return user;
  }
}
