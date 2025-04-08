import { Body, Controller, Get, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TouriiBackendService } from '../service/tourii-backend.service';
import { UserEntity } from '@app/core/domain/user/user.entity';

@Controller()
export class TouriiBackendController {
  constructor(private readonly touriiBackendService: TouriiBackendService) {}

  @Get('/health-check')
  @ApiTags('Health Check')
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
  checkHealth(): string {
    return 'OK';
  }

  @Post('/user')
  @ApiTags('User')
  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success' })
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
