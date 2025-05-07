import { Test, type TestingModule } from '@nestjs/testing';
import { TouriiOnchainService } from '../service/tourii-onchain.service';
import { TouriiOnchainController } from './tourii-onchain.controller';

describe('TouriiOnchainController', () => {
    let touriiOnchainController: TouriiOnchainController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [TouriiOnchainController],
            providers: [TouriiOnchainService],
        }).compile();

        touriiOnchainController = app.get<TouriiOnchainController>(TouriiOnchainController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            expect(touriiOnchainController.getHello()).toBe('Hello World!');
        });
    });
});
