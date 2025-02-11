import { Module } from "@nestjs/common";
import { TouriiOnchainController } from "./tourii-onchain.controller";
import { TouriiOnchainService } from "./tourii-onchain.service";

@Module({
	imports: [],
	controllers: [TouriiOnchainController],
	providers: [TouriiOnchainService],
})
export class TouriiOnchainModule {}
