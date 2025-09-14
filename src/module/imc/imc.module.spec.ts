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
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { getConnection } from 'typeorm';

describe('ImcModule (integration)', () => {
  let app: INestApplication;
  let service: ImcService;
  let jwtService: JwtService;

  beforeEach(async () => {
    // Variables de entorno de prueba
    process.env.JWT_AUTH_SECRET = 'testsecret';
    process.env.JWT_AUTH_EXPIRES_IN = '1h';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [ImcHistorial, User],
          synchronize: true,
          name: 'default', // Asegura que la conexión se llame "default"
        }),
        ImcModule,
      ],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({
              id: 1,
              email: 'test@mail.com',
              nombre: 'Test',
              contraseña: 'hashed',
              imcHistorial: [],
            }),
          },
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    service = moduleFixture.get<ImcService>(ImcService);
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterEach(async () => {
    if (app) {
      await app.close(); // Cierra la aplicación NestJS
    }
  });

  afterAll(async () => {
    // Cierra la conexión de TypeORM si existe
    try {
      const connection = getConnection('default');
      if (connection && connection.isConnected) {
        await connection.close();
      }
    } catch (error) {
      console.log('No se pudo cerrar la conexión de TypeORM:', error.message);
    }
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
    const token = jwtService.sign({ sub: 1, email: 'test@mail.com' });
    const response = await request(app.getHttpServer())
      .post('/imc/calcular')
      .set('Authorization', `Bearer ${token}`)
      .send(dto)
      .expect(201);

    expect(response.body).toEqual({
      imc: 22.86,
      categoria: 'Normal',
    });
  });

  it('should return 400 for non-numeric altura and not call the service', async () => {
    const invalidDto = { altura: 'invalid', peso: 70 };
    jest.spyOn(service, 'calcularImc');
    const token = jwtService.sign({ sub: 1, email: 'test@mail.com' });
    await request(app.getHttpServer())
      .post('/imc/calcular')
      .set('Authorization', `Bearer ${token}`)
      .send(invalidDto)
      .expect(400);

    expect(service.calcularImc).not.toHaveBeenCalled();
  });
});