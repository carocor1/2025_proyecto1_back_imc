import { Test, TestingModule } from '@nestjs/testing';
import { ImcHistorialService } from './imc-historial.service';
import { CreateImcHistorialDto } from './dto/create-imc-historial.dto';
import { ImcHistorialMapper } from './mappers/imc-historial.mapper';

describe('ImcHistorialService', () => {
  let service: ImcHistorialService;
  let repoMock: any;
  let mapperMock: any;
  // Mocks de datos - pueden ser ajustados según la estructura real
  const imcHistorialEntityMock = {
    id: 1,
    altura: 1.7,
    peso: 70,
    imc: 24.2,
    categoria: 'Normal',
    usuario: { id: 1 },
    fechaHora: new Date(),
  };
  const imcHistorialDtoMock: CreateImcHistorialDto = {
    altura: 1.7,
    peso: 70,
    imc: 24.2,
    categoria: 'Normal',
    usuarioId: 1,
  };
  const responseDtoMock = { ...imcHistorialEntityMock, usuario: undefined };
  const paginatedResponseMock = {
    historiales: [responseDtoMock],
    total: 1,
    page: 1,
    lastPage: 1,
  };
  repoMock = {
    create: jest.fn().mockResolvedValue(imcHistorialEntityMock),
    findAllByUser: jest.fn().mockResolvedValue([imcHistorialEntityMock]),
    findAllPaginatedByUser: jest
      .fn()
      .mockResolvedValue({
        historiales: [imcHistorialEntityMock],
        total: 1,
        page: 1,
        lastPage: 1,
      }),
  };
  mapperMock = {
    toResponseDto: jest.fn().mockReturnValue(responseDtoMock),
    toResponseDtos: jest.fn().mockReturnValue([responseDtoMock]),
    toResponsePaginationDto: jest
      .fn()
      .mockReturnValue({
        historiales: [responseDtoMock],
        total: 1,
        page: 1,
        lastPage: 1,
      }),
  };
  // Configuración del módulo de pruebas
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImcHistorialService,
        { provide: 'IImcHistorialRepository', useValue: repoMock },
        { provide: ImcHistorialMapper, useValue: mapperMock },
      ],
    }).compile();

    service = module.get<ImcHistorialService>(ImcHistorialService);
  });
  // Pruebas
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Pruebas para cada método del servicio
  it('create debe llamar al repo y al mapper', async () => {
    const result = await service.create(imcHistorialDtoMock);
    expect(repoMock.create).toHaveBeenCalledWith(imcHistorialDtoMock);
    expect(mapperMock.toResponseDto).toHaveBeenCalled();
    expect(result).toEqual(responseDtoMock);
  });

  it('findAll debe llamar al repo y al mapper', async () => {
    const result = await service.findAll(1);
    expect(repoMock.findAllByUser).toHaveBeenCalledWith(1);
    expect(mapperMock.toResponseDtos).toHaveBeenCalled();
    expect(result).toEqual([responseDtoMock]);
  });

  it('findAllPaginated debe llamar al repo y al mapper', async () => {
    const paginationDto = { limit: 5, page: 1 };
    const result = await service.findAllPaginated(paginationDto as any, 1);
    expect(repoMock.findAllPaginatedByUser).toHaveBeenCalledWith(1, 5, 1);
    expect(mapperMock.toResponsePaginationDto).toHaveBeenCalled();
    expect(result).toEqual(paginatedResponseMock);
  });
});
