import { Test, TestingModule } from '@nestjs/testing';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ImcHistorialService } from '../../imc-historial/imc-historial.service';

describe('ImcService', () => {
  let service: ImcService;
  let historialServiceMock: { create: jest.Mock };

  beforeEach(async () => {
    historialServiceMock = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImcService,
        { provide: ImcHistorialService, useValue: historialServiceMock },
      ],
    }).compile();

    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('calcularImc debe calcular el IMC, guardar historial y devolver la respuesta', async () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 70 };
    const usuarioId = 1;

    const result = await service.calcularImc(dto, usuarioId);

    expect(historialServiceMock.create).toHaveBeenCalledWith({
      altura: 1.7,
      peso: 70,
      imc: 24.22,
      categoria: 'Normal',
      usuarioId: 1,
    });
    expect(result).toEqual({ imc: 24.22, categoria: 'Normal' });
  });

  it('calcularImc debe devolver la categoría correcta para bajo peso', async () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 50 };
    const usuarioId = 2;

    const result = await service.calcularImc(dto, usuarioId);

    expect(result.categoria).toBe('Bajo peso');
  });

  it('calcularImc debe devolver la categoría correcta para sobrepeso', async () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 80 };
    const usuarioId = 3;

    const result = await service.calcularImc(dto, usuarioId);

    expect(result.categoria).toBe('Sobrepeso');
  });

  it('calcularImc debe devolver la categoría correcta para obeso', async () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 100 };
    const usuarioId = 4;

    const result = await service.calcularImc(dto, usuarioId);

    expect(result.categoria).toBe('Obeso');
  });
});