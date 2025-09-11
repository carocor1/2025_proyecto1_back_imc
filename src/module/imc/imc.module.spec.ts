import { Test, TestingModule } from '@nestjs/testing';
import { ImcModule } from './imc.module';
import { ImcController } from './imc.controller';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ImcHistorial } from '../../imc-historial/entities/imc-historial.entity';
import { User } from '../../users/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('ImcModule (integration)', () => {
  let app: INestApplication;
  let service: ImcService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([User, ImcHistorial]),
        ImcModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    service = moduleFixture.get<ImcService>(ImcService); // Obtener la instancia del servicio
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', async () => {
    expect(app).toBeDefined();
    const module = app.get(ImcModule);
    expect(module).toBeDefined();
  });

  it('should have ImcController and ImcService defined', async () => {
    const controller = app.get(ImcController);
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should calculate IMC and return category for valid input', async () => {
    const dto: CalcularImcDto = { altura: 1.75, peso: 70 };
    const response = await request(app.getHttpServer())
      .post('/imc/calcular')
      .send(dto)
      .expect(201);

    expect(response.body).toEqual({
      imc: 22.86, // 70 / (1.75 * 1.75) ≈ 22.86
      categoria: 'Normal',
    });
  });

  it('should return 400 for non-numeric altura and not call the service', async () => {
    const invalidDto = { altura: 'invalid', peso: 70 };
    jest.spyOn(service, 'calcularImc');

    await request(app.getHttpServer())
      .post('/imc/calcular')
      .send(invalidDto)
      .expect(400);

    expect(service.calcularImc).not.toHaveBeenCalled();
  });
});
