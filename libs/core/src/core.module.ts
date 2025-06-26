import { Module } from '@nestjs/common';
import { CoreService } from './core.service';
import { GoogleWalletRepositoryApi } from './infrastructure/passport/google-wallet.repository-api';
import { CachingService } from './provider/caching.service';

@Module({
    providers: [CoreService, CachingService, GoogleWalletRepositoryApi],
    exports: [CoreService, CachingService, GoogleWalletRepositoryApi],
})
export class CoreModule {}
