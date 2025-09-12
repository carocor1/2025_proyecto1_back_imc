import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  const loginDto = { email: 'test@mail.com', contraseña: '123456' };
  const createUserDto = { email: 'test@mail.com', contraseña: '123456', nombre: 'Test' };
  const loginResponse = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    user: { id: 1, email: 'test@mail.com', nombre: 'Test' },
  };
  const registerResponse = { access_token: 'access-token' };

  beforeEach(async () => {
    const serviceMock = {
      login: jest.fn().mockResolvedValue(loginResponse),
      register: jest.fn().mockResolvedValue(registerResponse),
      refresh: jest.fn().mockResolvedValue(loginResponse),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: serviceMock }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('login debe llamar a AuthService.login y devolver el resultado', async () => {
    const result = await controller.login(loginDto);
    expect(service.login).toHaveBeenCalledWith(loginDto);
    expect(result).toEqual(loginResponse);
  });

  it('register debe llamar a AuthService.register y devolver el resultado', async () => {
    const result = await controller.register(createUserDto);
    expect(service.register).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(registerResponse);
  });

  it('refresh debe llamar a AuthService.refresh y devolver el resultado', async () => {
    const result = await controller.refresh('refresh-token');
    expect(service.refresh).toHaveBeenCalledWith('refresh-token');
    expect(result).toEqual(loginResponse);
  });
});