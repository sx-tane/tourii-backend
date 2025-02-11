import { Injectable } from "@nestjs/common";

@Injectable()
export class TouriiOnchainService {
	getHello(): string {
		return "Hello World Tourii Onchain!";
	}
}
