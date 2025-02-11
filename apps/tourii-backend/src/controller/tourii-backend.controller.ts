import { Controller, Get, HttpStatus, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TouriiBackendService } from '../service/tourii-backend.service';

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

  @Get('/:username/user')
  @ApiTags('User')
  @ApiOperation({
    summary: 'Get User API',
    description: 'Get user by username',
  })
  async getUserByUsername(@Param('username') username: string): Promise<any> {
    const user = await this.touriiBackendService.getUserByUsername(username);
    return user;
  }
}
