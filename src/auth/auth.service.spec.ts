import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { JwtService } from '../jwt/jwt.service';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  // Mocks de datos - pueden ser ajustados según la estructura real
  const userMock = {
    id: 1,
    email: 'test@mail.com',
    nombre: 'Test',
    contraseña: 'hashedPassword',
    imcHistorial: [],
    passwordResetExpiration: new Date('2025-01-01'),
    passwordResetToken: null,
  };
  // Configuración del módulo de pruebas
  beforeEach(async () => {
    const usersServiceMock: jest.Mocked<Partial<UsersService>> = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findOne: jest.fn(),
    };
    const jwtServiceMock: jest.Mocked<Partial<JwtService>> = {
      generateToken: jest.fn().mockReturnValue('jwt-token'),
      refreshToken: jest.fn().mockReturnValue({ accessToken: 'new-access', refreshToken: 'new-refresh' }),
      getPayload: jest.fn().mockReturnValue({ sub: '1', email: 'test@mail.com' }),
    };
    // Reset de mocks de bcrypt - importante para evitar interferencias entre tests
    (bcrypt.compareSync as jest.Mock).mockReset();
    (bcrypt.hashSync as jest.Mock).mockReset();
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });
  // Pruebas
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('debería lanzar Unauthorized si el usuario no existe', async () => {
      usersService.findByEmail!.mockResolvedValue(null);
      await expect(service.login({ email: 'x', contraseña: 'y' })).rejects.toThrow(UnauthorizedException);
    });

    it('debería lanzar Unauthorized si la contraseña es incorrecta', async () => {
      usersService.findByEmail!.mockResolvedValue(userMock);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);
      await expect(service.login({ email: 'test@mail.com', contraseña: 'wrong' })).rejects.toThrow(UnauthorizedException);
    });

    it('debería devolver tokens y usuario si login es correcto', async () => {
      usersService.findByEmail!.mockResolvedValue(userMock);
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
      const result = await service.login({ email: 'test@mail.com', contraseña: '123456' });
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(jwtService.generateToken).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('debería lanzar Conflict si el usuario ya existe', async () => {
      usersService.findByEmail!.mockResolvedValue(userMock);
      await expect(service.register({ email: 'test@mail.com', contraseña: '123', nombre: 'Test' })).rejects.toThrow(ConflictException);
    });

    it('debería crear usuario y devolver access_token', async () => {
      usersService.findByEmail!.mockResolvedValue(null);
      (bcrypt.hashSync as jest.Mock).mockReturnValue('hashed');
      usersService.create!.mockResolvedValue({ ...userMock, contraseña: 'hashed' });
      const result = await service.register({ email: 'test@mail.com', contraseña: '123', nombre: 'Test' });
      expect(result).toHaveProperty('accessToken');
      expect(usersService.create).toHaveBeenCalled();
    });
  });

  describe('refresh', () => {
    it('debería devolver nuevos tokens y usuario', async () => {
      usersService.findOne!.mockResolvedValue(userMock);
      const result = await service.refresh('refresh-token');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
      expect(result).toHaveProperty('user');
      expect(jwtService.refreshToken).toHaveBeenCalledWith('refresh-token');
    });

    it('debería lanzar Unauthorized si el usuario no existe', async () => {
      usersService.findOne!.mockResolvedValue(null as any);
      await expect(service.refresh('refresh-token')).rejects.toThrow(UnauthorizedException);
    });
  });
});