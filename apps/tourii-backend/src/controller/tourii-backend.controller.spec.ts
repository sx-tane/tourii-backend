import { Test, type TestingModule } from '@nestjs/testing';
import { TouriiBackendService } from '../service/tourii-backend.service';
import { TouriiBackendController } from './tourii-backend.controller';

describe('AppController', () => {
  let appController: TouriiBackendController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TouriiBackendController],
      providers: [TouriiBackendService],
    }).compile();

    appController = app.get<TouriiBackendController>(TouriiBackendController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
