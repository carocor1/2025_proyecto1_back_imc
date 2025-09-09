import { Test, TestingModule } from '@nestjs/testing';
import { ImcHistorialController } from './imc-historial.controller';
import { ImcHistorialService } from './imc-historial.service';

describe('ImcHistorialController', () => {
  let controller: ImcHistorialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcHistorialController],
      providers: [ImcHistorialService],
    }).compile();

    controller = module.get<ImcHistorialController>(ImcHistorialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
