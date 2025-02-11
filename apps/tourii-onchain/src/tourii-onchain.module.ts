import { Module } from '@nestjs/common';
import { TouriiOnchainService } from './service/tourii-onchain.service';
import { TouriiOnchainController } from './tourii-onchain.controller';

@Module({
  imports: [],
  controllers: [TouriiOnchainController],
  providers: [TouriiOnchainService],
})
export class TouriiOnchainModule {}
