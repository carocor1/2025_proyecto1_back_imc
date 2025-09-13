import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthGuard } from '../middleware/auth.middleware';
import { UpdateUserDto } from './dto/update-user.dto';
import { RespuestaUserDto } from './dto/respuesta-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = { id: 1, nombre: 'alejo', email: 'alejo@gmail.com' };
  const mockRespuesta: RespuestaUserDto = { ...mockUser };

  const mockUsersService = {
    findMe: jest.fn().mockResolvedValue(mockRespuesta),
    update: jest.fn().mockResolvedValue(mockRespuesta),
  };

  const mockAuthGuard = {
    canActivate: jest.fn(() => true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findMe', () => {
    it('should return the user profile', async () => {
      const req = { user: { id: 1 } } as any;
      const result = await controller.findMe(req);
      expect(result).toEqual(mockRespuesta);
      expect(service.findMe).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update and return the user profile', async () => {
      const req = { user: { id: 1 } } as any;
      const updateUserDto: UpdateUserDto = { nombre: 'alejo2', email: 'alejo2@gmail.com' };
      const result = await controller.update(updateUserDto, req);
      expect(result).toEqual(mockRespuesta);
      expect(service.update).toHaveBeenCalledWith(1, updateUserDto);
    });
  });
});
