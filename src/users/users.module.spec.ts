import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from './users.module';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersModule (integration)', () => {
  let app: INestApplication;
  let service: UsersService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    service = moduleFixture.get<UsersService>(UsersService); 
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', async () => {
    expect(app).toBeDefined();
    const module = app.get(UsersModule);
    expect(module).toBeDefined();
  });

  it('should have UsersController and UsersService defined', async () => {
    const controller = app.get(UsersController);
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
  

  it('POST /users crea un usuario', async () => {
    const userDto = { nombre: 'Alejo', email: 'alejo@gmail.com' };
    const res = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);

    expect(res.body).toMatchObject(userDto);
    expect(res.body.id).toBeDefined();
  });

  it('GET /users/:id devuelve el usuario', async () => {
    const userDto = { nombre: 'Alejo', email: 'alejo@gmail.com' };
    const postRes = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);

    const id = postRes.body.id;

    const getRes = await request(app.getHttpServer())
      .get(`/users/${id}`)
      .expect(200);

    expect(getRes.body).toMatchObject(userDto);
    expect(getRes.body.id).toBe(id);
  });

  it('PATCH /users/:id actualiza el usuario', async () => {
    const userDto = { nombre: 'Alejo', email: 'alejo@gmail.com' };
    const postRes = await request(app.getHttpServer())
      .post('/users')
      .send(userDto)
      .expect(201);

    const id = postRes.body.id;
    const updateDto = { nombre: 'Alejo2' };

    const patchRes = await request(app.getHttpServer())
      .patch(`/users/${id}`)
      .send(updateDto)
      .expect(200);

    expect(patchRes.body.nombre).toBe('Alejo2');
    expect(patchRes.body.email).toBe('alejo@gmail.com');
  });
});