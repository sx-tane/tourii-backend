import { Test, type TestingModule } from "@nestjs/testing";
import { TouriiOnchainController } from "./tourii-onchain.controller";
import { TouriiOnchainService } from "./tourii-onchain.service";

describe("TouriiOnchainController", () => {
	let touriiOnchainController: TouriiOnchainController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [TouriiOnchainController],
			providers: [TouriiOnchainService],
		}).compile();

		touriiOnchainController = app.get<TouriiOnchainController>(
			TouriiOnchainController,
		);
	});

	describe("root", () => {
		it('should return "Hello World!"', () => {
			expect(touriiOnchainController.getHello()).toBe("Hello World!");
		});
	});
});
