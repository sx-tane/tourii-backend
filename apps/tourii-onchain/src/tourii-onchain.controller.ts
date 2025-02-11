import { Controller, Get } from "@nestjs/common";
import type { TouriiOnchainService } from "./tourii-onchain.service";

@Controller()
export class TouriiOnchainController {
	constructor(private readonly touriiOnchainService: TouriiOnchainService) {}

	@Get()
	getHello(): string {
		return this.touriiOnchainService.getHello();
	}
}
