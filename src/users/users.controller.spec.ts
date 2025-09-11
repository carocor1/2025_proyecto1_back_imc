import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ImcHistorial } from 'src/imc-historial/entities/imc-historial.entity';

const userMock: User = {
  id: 1,
  nombre: "Alejo",
  email: "alejo@gmail.com",
  contraseña: "contraseña123",
  imcHistorial: [] as ImcHistorial[],
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const serviceMock = {
      create: jest.fn().mockResolvedValue(userMock),
      findOne: jest.fn().mockResolvedValue(userMock),
      update: jest.fn().mockResolvedValue(userMock),
      findByEmail: jest.fn().mockResolvedValue(userMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: serviceMock },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  
  it('findOne should call service and return user', async () => {
    const result = await controller.findOne('1');
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(userMock);
  });

  it('update should call service and return user', async () => {
    const dto = { nombre: "Nuevo" };
    const result = await controller.update('1', dto as any);
    expect(service.update).toHaveBeenCalledWith(1, dto);
    expect(result).toEqual(userMock);
  });
});
