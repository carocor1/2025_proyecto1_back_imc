import { Test, TestingModule } from '@nestjs/testing';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';

describe('ImcService', () => {
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImcService],
    }).compile();

    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate IMC correctly', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(22.86, 2); // Redondeado a 2 decimales
    expect(result.categoria).toBe('Normal');
  });

  it('should return Bajo peso for IMC < 18.5', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 50 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(16.33, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('should return Sobrepeso for 25 <= IMC < 30', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 80 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(26.12, 2);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('should return Obeso for IMC >= 30', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 100 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(32.65, 2);
    expect(result.categoria).toBe('Obeso');
  });

  //75 / (1.8 * 1.8) ≈ 23.1481, redondeado a 23.15
  it('debería redondear el IMC a dos decimales', () => {
    const dto: CalcularImcDto = { peso: 75, altura: 1.8 };
    const resultado = service.calcularImc(dto);
    expect(resultado.imc).toBe(23.15);
    expect(resultado.categoria).toBe('Normal');
  });

  // 53.45 / (1.7 * 1.7) ≈ 18.49
  it('debería manejar correctamente valores límite para la categoría "Bajo peso"', () => {
    const dto: CalcularImcDto = { peso: 53.45, altura: 1.7 };
    const resultado = service.calcularImc(dto);
    expect(resultado.imc).toBe(18.49);
    expect(resultado.categoria).toBe('Bajo peso');
  });

  // 72.23 / (1.7 * 1.7) ≈ 24.99
  it('debería manejar correctamente valores límite para la categoría "Normal"', () => {
    const dto: CalcularImcDto = { peso: 72.23, altura: 1.7 };
    const resultado = service.calcularImc(dto);
    expect(resultado.imc).toBe(24.99);
    expect(resultado.categoria).toBe('Normal');
  });
});
