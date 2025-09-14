import { JwtService } from './jwt.service';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

jest.mock('@nestjs/jwt');

describe('JwtService', () => {
  let service: JwtService;
  let jwtServiceMock: jest.Mocked<NestJwtService>;

  beforeEach(() => {
    // Mock de NestJwtService para simular inyección
    jwtServiceMock = {
      sign: jest.fn(),
      verify: jest.fn(),
    } as any;

    service = new JwtService(jwtServiceMock); // Instancia del servicio con mock
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token with auth config by default', () => {
      jwtServiceMock.sign.mockReturnValue('signed-token');
      const payload = { email: 'test@mail.com', sub: '1' };
      const token = service.generateToken(payload);
      expect(jwtServiceMock.sign).toHaveBeenCalledWith(payload, {
        secret: 'authSecret',
        expiresIn: '15m',
      }); // Verifica configuración por defecto
      expect(token).toBe('signed-token');
    });

    it('should generate a token with refresh config', () => {
      jwtServiceMock.sign.mockReturnValue('refresh-token');
      const payload = { email: 'test@mail.com', sub: '1' };
      const token = service.generateToken(payload, 'refresh');
      expect(jwtServiceMock.sign).toHaveBeenCalledWith(payload, {
        secret: 'refreshSecret',
        expiresIn: '1d',
      }); // Verifica configuración de refresco
      expect(token).toBe('refresh-token');
    });
  });

  describe('refreshToken', () => {
    const payload = {
      email: 'test@mail.com',
      sub: '1',
      exp: Math.floor(Date.now() / 1000) + 60 * 10, // 10 minutos en el futuro
    };

    it('should return new accessToken and refreshToken if less than 20 minutes to expire', () => {
      jwtServiceMock.verify.mockReturnValue(payload);
      jest.spyOn(service, 'generateToken').mockImplementation((p, t) =>
        t === 'refresh' ? 'new-refresh' : 'new-access'
      ); // Simula generación de nuevos tokens

      const result = service.refreshToken('refresh-token');
      expect(jwtServiceMock.verify).toHaveBeenCalledWith('refresh-token', {
        secret: 'refreshSecret',
      });
      expect(result).toEqual({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });
    });

    it('should return only accessToken if more than 20 minutes to expire', () => {
      jwtServiceMock.verify.mockReturnValue({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + 60 * 30, // 30 minutos en el futuro
      });
      jest.spyOn(service, 'generateToken').mockReturnValue('new-access');

      const result = service.refreshToken('refresh-token');
      expect(result).toEqual({
        accessToken: 'new-access',
      });
    });

    it('should throw UnauthorizedException if token is invalid', () => {
      jwtServiceMock.verify.mockImplementation(() => {
        throw new Error('invalid');
      });
      expect(() => service.refreshToken('bad-token')).toThrow(UnauthorizedException); // Prueba de manejo de errores
    });
  });

  describe('getPayload', () => {
    it('should verify token with auth secret by default', () => {
      jwtServiceMock.verify.mockReturnValue({ email: 'a', sub: 'b' });
      const result = service.getPayload('token');
      expect(jwtServiceMock.verify).toHaveBeenCalledWith('token', {
        secret: 'authSecret',
      }); // Verifica con secreto de autenticación
      expect(result).toEqual({ email: 'a', sub: 'b' });
    });

    it('should verify token with refresh secret if type is refresh', () => {
      jwtServiceMock.verify.mockReturnValue({ email: 'a', sub: 'b' });
      const result = service.getPayload('token', 'refresh');
      expect(jwtServiceMock.verify).toHaveBeenCalledWith('token', {
        secret: 'refreshSecret',
      }); // Verifica con secreto de refresco
      expect(result).toEqual({ email: 'a', sub: 'b' });
    });
  });
});