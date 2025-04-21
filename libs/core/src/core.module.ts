import { Module } from "@nestjs/common";
import { CoreService } from "./core.service";
import { CachingService } from "./provider/caching.service";

@Module({
	providers: [CoreService, CachingService],
	exports: [CoreService, CachingService],
})
export class CoreModule {}
