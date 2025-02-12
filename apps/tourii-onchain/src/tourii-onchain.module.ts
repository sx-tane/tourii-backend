import { EncryptionRepositoryAuth } from '@app/core/infrastructure/authentication/encryption-repository-auth';
import { JwtRepositoryAuth } from '@app/core/infrastructure/authentication/jwt-repository-auth';
import { Module } from '@nestjs/common';
import { TouriiOnchainController } from './controller/tourii-onchain.controller';
import { TouriiOnchainService } from './service/tourii-onchain.service';

@Module({
  imports: [],
  controllers: [TouriiOnchainController],
  providers: [
    TouriiOnchainService,
    // SailsCallsRepository,
    // GearApiRepository,
    JwtRepositoryAuth,
    EncryptionRepositoryAuth,
  ],
})
export class TouriiOnchainModule {}
