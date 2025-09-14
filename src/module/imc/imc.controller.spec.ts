import { Test, TestingModule } from '@nestjs/testing';
import { ImcController } from './imc.controller';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { AuthGuard} from '../../middleware/auth.middleware';

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
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-token'),
            getPayload: jest.fn().mockReturnValue({ sub: '1', email: 'test@mail.com' }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ id: 1, email: 'test@mail.com', nombre: 'Test' }),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard) // Sobrescribe tu AuthGuard personalizado
      .useValue({ canActivate: () => true }) // Mock para permitir acceso
      .compile();

    controller = module.get<ImcController>(ImcController);
    service = module.get<ImcService>(ImcService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should throw BadRequestException for invalid input', async () => {
    const invalidDto: CalcularImcDto = { altura: -1, peso: 70 };
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

  it('should throw BadRequestException for non-numeric altura', async () => {
    const dtoInvalido = { altura: 'esEscrita!!', peso: 70 };
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
    const invalidDto = { altura: null, peso: 70 };
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
});