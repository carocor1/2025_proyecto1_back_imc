import { Test, TestingModule } from '@nestjs/testing';
import { ImcService } from './imc.service';
import { ImcHistorialService } from '../../imc-historial/imc-historial.service';
import { BajoPesoStrategy } from './strategies/imc-bajo-peso.strategy';
import { NormalStrategy } from './strategies/imc-normal.strategy';
import { SobrepesoStrategy } from './strategies/imc-sobrepeso.strategy';
import { ObesoStrategy } from './strategies/imc-obeso.strategy';
import { CalcularImcDto } from './dto/calcular-imc-dto';

describe('ImcService', () => {
  let service: ImcService;
  let historialServiceMock: { create: jest.Mock };

  beforeEach(async () => {
    historialServiceMock = { create: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImcService,
        { provide: ImcHistorialService, useValue: historialServiceMock },
        BajoPesoStrategy,
        NormalStrategy,
        SobrepesoStrategy,
        ObesoStrategy,
        {
          provide: 'CATEGORIA_STRATEGIES',
          useFactory: (
            bajoPeso: BajoPesoStrategy,
            normal: NormalStrategy,
            sobrepeso: SobrepesoStrategy,
            obeso: ObesoStrategy,
          ) => {
            return [bajoPeso, normal, sobrepeso, obeso];
          },
          inject: [
            BajoPesoStrategy,
            NormalStrategy,
            SobrepesoStrategy,
            ObesoStrategy,
          ],
        },
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
    const imcEsperado = Math.round((70 / (1.7 * 1.7)) * 100) / 100; // 24.22

    const result = await service.calcularImc(dto, usuarioId);

    expect(historialServiceMock.create).toHaveBeenCalledWith({
      altura: 1.7,
      peso: 70,
      imc: imcEsperado,
      categoria: 'Normal',
      usuarioId: 1,
    });
    expect(result).toEqual({ imc: imcEsperado, categoria: 'Normal' });
  });

  it('calcularImc debe devolver la categoría correcta para bajo peso', async () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 50 };
    const usuarioId = 2;
    const imcEsperado = Math.round((50 / (1.7 * 1.7)) * 100) / 100; // 17.3

    const result = await service.calcularImc(dto, usuarioId);

    expect(result).toEqual({ imc: imcEsperado, categoria: 'Bajo peso' });
    expect(historialServiceMock.create).toHaveBeenCalledWith({
      altura: 1.7,
      peso: 50,
      imc: imcEsperado,
      categoria: 'Bajo peso',
      usuarioId: 2,
    });
  });

  it('calcularImc debe devolver la categoría correcta para sobrepeso', async () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 80 };
    const usuarioId = 3;
    const imcEsperado = Math.round((80 / (1.7 * 1.7)) * 100) / 100; // 27.68

    const result = await service.calcularImc(dto, usuarioId);

    expect(result).toEqual({ imc: imcEsperado, categoria: 'Sobrepeso' });
    expect(historialServiceMock.create).toHaveBeenCalledWith({
      altura: 1.7,
      peso: 80,
      imc: imcEsperado,
      categoria: 'Sobrepeso',
      usuarioId: 3,
    });
  });

  it('calcularImc debe devolver la categoría correcta para obeso', async () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 100 };
    const usuarioId = 4;
    const imcEsperado = Math.round((100 / (1.7 * 1.7)) * 100) / 100; // 34.6

    const result = await service.calcularImc(dto, usuarioId);

    expect(result).toEqual({ imc: imcEsperado, categoria: 'Obeso' });
    expect(historialServiceMock.create).toHaveBeenCalledWith({
      altura: 1.7,
      peso: 100,
      imc: imcEsperado,
      categoria: 'Obeso',
      usuarioId: 4,
    });
  });
});
