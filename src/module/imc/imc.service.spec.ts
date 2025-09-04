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

  it('should calculate IMC correctly with minimum altura (0.1)', () => {
    const dto: CalcularImcDto = { altura: 0.1, peso: 1 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBe(100);
    expect(result.categoria).toBe('Obeso');
  });

  it('should calculate IMC correctly with maximum altura (3)', () => {
    const dto: CalcularImcDto = { altura: 3, peso: 80 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(8.89, 2);
    expect(result.categoria).toBe('Bajo peso');
  });

  it('should calculate IMC correctly with minimum peso (1)', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 1 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(0.33, 2);
    expect(result.categoria).toBe('Bajo peso');
  });
    
  it('should calculate IMC correctly with maximum peso (500)', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 500 };
    const result = service.calcularImc(dto);
    expect(result.imc).toBeCloseTo(163.27, 2);
    expect(result.categoria).toBe('Obeso');
  });

  it('should return Normal for IMC just below 25 (24.99)', () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 72.23 }; // 72.23 / (1.7 * 1.7) ≈ 24.99
    const result = service.calcularImc(dto);
    expect(result.imc).toBe(24.99);
    expect(result.categoria).toBe('Normal');
  });

  it('should return Sobrepeso for IMC just below 30 (29.99)', () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 86.67 }; // 86.67 / (1.7 * 1.7) ≈ 29.99
    const result = service.calcularImc(dto);
    expect(result.imc).toBe(29.99);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('should return Normal for IMC just above 18.5 (18.51)', () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 53.51 }; // 53.51 / (1.7 * 1.7) ≈ 18.514878 -> redondea a 18.52
    const result = service.calcularImc(dto);
    expect(result.imc).toBe(18.52);
    expect(result.categoria).toBe('Normal');
  });

  it('should return Sobrepeso for IMC just above 25 (25.01)', () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 72.29 }; // 72.29 / (1.7 * 1.7) ≈ 25.01
    const result = service.calcularImc(dto);
    expect(result.imc).toBe(25.01);
    expect(result.categoria).toBe('Sobrepeso');
  });

  it('should return Obeso for IMC just above 30 (30.01)', () => {
    const dto: CalcularImcDto = { altura: 1.7, peso: 86.73 }; // 86.73 / (1.7 * 1.7) ≈ 30.01
    const result = service.calcularImc(dto);
    expect(result.imc).toBe(30.01);
    expect(result.categoria).toBe('Obeso');
  });

  it('debería manejar peso 0 y devolver IMC 0 con categoría "Bajo peso"', () => { // caso peso cero
    const dto: CalcularImcDto = { altura: 1.75, peso: 0 };
    const resultado = service.calcularImc(dto);
    expect(resultado.imc).toBe(0);
    expect(resultado.categoria).toBe('Bajo peso');
  });

  it('debería redondear correctamente IMC con decimales muy largos', () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 65.123456789 }; // 65.123456789 / (1.75 * 1.75) ≈ 21.26029 -> redondea a 21.26
    const resultado = service.calcularImc(dto);
    expect(resultado.imc).toBe(21.26);
    expect(resultado.categoria).toBe('Normal');
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
