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


  describe('findMe', () => {
    it('debería devolver el usuario autenticado', async () => {
      const req = { user: { id: 1 } } as any;
      const result = await controller.findMe(req);
      expect(service.findMe).toHaveBeenCalledWith(1);
      expect(result).toEqual(userMock);
    });
  });

  describe('update', () => {
    it('debería actualizar y devolver el usuario', async () => {
      const req = { user: { id: 1 } } as any;
      const updateUserDto = { nombre: 'NuevoNombre' };
      const result = await controller.update(updateUserDto, req);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(userMock);
    });
  });
});