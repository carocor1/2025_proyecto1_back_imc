import { Test, TestingModule } from '@nestjs/testing';
import { ImcHistorialService } from './imc-historial.service';

describe('ImcHistorialService', () => {
  let service: ImcHistorialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImcHistorialService],
    }).compile();

    service = module.get<ImcHistorialService>(ImcHistorialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
