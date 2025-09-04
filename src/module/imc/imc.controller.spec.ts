import { Test, TestingModule } from '@nestjs/testing';
import { ImcController } from './imc.controller';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

describe('ImcController', () => {
  let controller: ImcController;
  let service: ImcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImcController],
      providers: [
        {
          provide: ImcService,
          useValue: {
            calcularImc: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ImcController>(ImcController);
    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return IMC and category for valid input', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    jest
      .spyOn(service, 'calcularImc')
      .mockReturnValue({ imc: 22.86, categoria: 'Normal' });

    const result = await controller.calcular(dto);
    expect(result).toEqual({ imc: 22.86, categoria: 'Normal' });
    expect(service.calcularImc).toHaveBeenCalledWith(dto);
  });

  it('should throw BadRequestException for invalid input', async () => {
    const invalidDto: CalcularImcDto = { altura: -1, peso: 70 };

    // Aplicar ValidationPipe manualmente en la prueba
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    await expect(
      validationPipe.transform(invalidDto, {
        type: 'body',
        metatype: CalcularImcDto,
      }),
    ).rejects.toThrow(BadRequestException);

    // Verificar que el servicio no se llama porque la validación falla antes
    expect(service.calcularImc).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for non-numeric altura', async () => {
    const dtoInvalido = { altura: 'esEscrita!!', peso: 70 }; // Altura no numérica
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    await expect(
      validationPipe.transform(dtoInvalido, {
        type: 'body',
        metatype: CalcularImcDto,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(service.calcularImc).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for altura below minimum (0.099)', async () => {
    const invalidDto: CalcularImcDto = { altura: 0.099, peso: 70 };
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    await expect(
      validationPipe.transform(invalidDto, {
        type: 'body',
        metatype: CalcularImcDto,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(service.calcularImc).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for altura above maximum (3.001)', async () => {
    const invalidDto: CalcularImcDto = { altura: 3.001, peso: 70 };
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    await expect(
      validationPipe.transform(invalidDto, {
        type: 'body',
        metatype: CalcularImcDto,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(service.calcularImc).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for peso below minimum (0.999)', async () => {
    const invalidDto: CalcularImcDto = { altura: 1.75, peso: 0.999 };
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    await expect(
      validationPipe.transform(invalidDto, {
        type: 'body',
        metatype: CalcularImcDto,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(service.calcularImc).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException for null altura or peso', async () => {
    const invalidDto = { altura: null, peso: 70 }; // Null en altura
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    await expect(
      validationPipe.transform(invalidDto, {
        type: 'body',
        metatype: CalcularImcDto,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(service.calcularImc).not.toHaveBeenCalled();
  });

  it('should propagate error when service throws an exception', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const error = new Error('Unexpected error in service');
    jest.spyOn(service, 'calcularImc').mockImplementation(() => {
      throw error;
    });
    try {
      await controller.calcular(dto);
      fail('Expected controller.calcular to throw an error');
    } catch (e) {
      expect(e.message).toBe('Unexpected error in service');
    }
    expect(service.calcularImc).toHaveBeenCalledWith(dto);
  });

  it('should throw BadRequestException for altura zero', async () => {
    const invalidDto: CalcularImcDto = { altura: 0, peso: 70 };
    const validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    });
    await expect(
      validationPipe.transform(invalidDto, {
        type: 'body',
        metatype: CalcularImcDto,
      }),
    ).rejects.toThrow(BadRequestException);
    expect(service.calcularImc).not.toHaveBeenCalled();
  });

  it('should handle valid input with minimum altura and maximum peso', async () => {
    const dto: CalcularImcDto = { altura: 0.1, peso: 500 }; // IMC = 500 / (0.1 * 0.1) = 50000
    jest.spyOn(service, 'calcularImc').mockReturnValue({ imc: 50000, categoria: 'Obeso' });
    const result = await controller.calcular(dto);
    expect(result).toEqual({ imc: 50000, categoria: 'Obeso' });
    expect(service.calcularImc).toHaveBeenCalledWith(dto);
  });
});
