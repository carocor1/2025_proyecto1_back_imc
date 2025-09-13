import { Test, TestingModule } from '@nestjs/testing';
import { ImcHistorialController } from './imc-historial.controller';
import { ImcHistorialService } from './imc-historial.service';
import { AuthGuard } from '../middleware/auth.middleware'; 

describe('ImcHistorialController', () => {
  let controller: ImcHistorialController;
  let service: ImcHistorialService;

  const userMock = { id: 1 };
  const reqMock = { user: userMock } as any;
  const historialMock = [{ altura: 1.7, peso: 70, imc: 24.2, categoria: 'Normal', fechaHora: new Date() }];
  const paginatedMock = { historiales: historialMock, total: 1, page: 1, lastPage: 1 };

  beforeEach(async () => {
    const serviceMock = {
      findAll: jest.fn().mockResolvedValue(historialMock),
      findAllPaginated: jest.fn().mockResolvedValue(paginatedMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcHistorialController],
      providers: [
        { provide: ImcHistorialService, useValue: serviceMock },
        { provide: AuthGuard, useValue: { canActivate: jest.fn().mockReturnValue(true) } }, // mockea el guard
      ],
    }).overrideGuard(AuthGuard).useValue({ canActivate: jest.fn().mockReturnValue(true) }) // override si usas @UseGuards(AuthGuard)
      .compile();

    controller = module.get<ImcHistorialController>(ImcHistorialController);
    service = module.get<ImcHistorialService>(ImcHistorialService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll debe devolver el historial del usuario', async () => {
    const result = await controller.findAll(reqMock);
    expect(service.findAll).toHaveBeenCalledWith(userMock.id);
    expect(result).toEqual(historialMock);
  });

  it('findAllPaginated debe devolver el historial paginado', async () => {
    const paginationDto = { page: 1, limit: 10 };
    const result = await controller.findAllPaginated(paginationDto as any, reqMock);
    expect(service.findAllPaginated).toHaveBeenCalledWith(paginationDto, userMock.id);
    expect(result).toEqual(paginatedMock);
  });
});