import { JwtService } from './jwt.service';
import { UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('JwtService', () => {
  let service: JwtService;
  let configService: { get: jest.Mock };

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_AUTH_SECRET') return 'auth-secret';
        if (key === 'JWT_REFRESH_SECRET') return 'refresh-secret';
        if (key === 'JWT_AUTH_EXPIRES_IN') return '60m';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return undefined;
      }),
    } as any;
    service = new JwtService(configService as any);
    jest.clearAllMocks();
  });

  describe('generateToken', () => {
    it('should generate a token with auth config by default', () => {
      (jwt.sign as jest.Mock).mockReturnValue('signed-token');
      const payload = { email: 'test@mail.com', sub: '1' };
      const token = service.generateToken(payload);
      expect(configService.get).toHaveBeenCalledWith('JWT_AUTH_SECRET');
      expect(configService.get).toHaveBeenCalledWith('JWT_AUTH_EXPIRES_IN');
      expect(jwt.sign).toHaveBeenCalledWith(payload, 'auth-secret', { expiresIn: '60m' });
      expect(token).toBe('signed-token');
    });

    it('should generate a token with refresh config', () => {
      (jwt.sign as jest.Mock).mockReturnValue('refresh-token');
      const payload = { email: 'test@mail.com', sub: '1' };
      const token = service.generateToken(payload, 'refresh');
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_EXPIRES_IN');
      expect(jwt.sign).toHaveBeenCalledWith(payload, 'refresh-secret', { expiresIn: '7d' });
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
      // expira en 10 minutos
      (jwt.verify as jest.Mock).mockReturnValue({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + 60 * 10,
      });
      jest.spyOn(service, 'generateToken').mockImplementation((p, t) => t === 'refresh' ? 'new-refresh' : 'new-access');

      const result = service.refreshToken('refresh-token');
      expect(jwt.verify).toHaveBeenCalledWith('refresh-token', 'refresh-secret');
      expect(result).toEqual({
        accessToken: 'new-access',
        refreshToken: 'new-refresh',
      });
    });

    it('should return only accessToken if more than 20 minutes to expire', () => {
      // expira en 30 minutos
      (jwt.verify as jest.Mock).mockReturnValue({
        ...payload,
        exp: Math.floor(Date.now() / 1000) + 60 * 30,
      });
      jest.spyOn(service, 'generateToken').mockImplementation((p, t) => t === 'refresh' ? 'new-refresh' : 'new-access');

      const result = service.refreshToken('refresh-token');
      expect(result).toEqual({
        accessToken: 'new-access',
      });
    });

    it('should throw UnauthorizedException if token is invalid', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('invalid'); });
      expect(() => service.refreshToken('bad-token')).toThrow(UnauthorizedException);
    });
  });

  describe('getPayload', () => {
    it('should verify token with auth secret by default', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ email: 'a', sub: 'b' });
      const result = service.getPayload('token');
      expect(configService.get).toHaveBeenCalledWith('JWT_AUTH_SECRET');
      expect(jwt.verify).toHaveBeenCalledWith('token', 'auth-secret');
      expect(result).toEqual({ email: 'a', sub: 'b' });
    });

    it('should verify token with refresh secret if type is refresh', () => {
      (jwt.verify as jest.Mock).mockReturnValue({ email: 'a', sub: 'b' });
      const result = service.getPayload('token', 'refresh');
      expect(configService.get).toHaveBeenCalledWith('JWT_REFRESH_SECRET');
      expect(jwt.verify).toHaveBeenCalledWith('token', 'refresh-secret');
      expect(result).toEqual({ email: 'a', sub: 'b' });
    });
  });

  describe('getJwtConfig', () => {
    it('should throw if secret is missing', () => {
      configService.get = jest.fn().mockReturnValueOnce(undefined);
      expect(() => (service as any).getJwtConfig('auth')).toThrow('Missing JWT auth secret');
    });
    it('should return secret and expiresIn', () => {
      const result = (service as any).getJwtConfig('auth');
      expect(result).toEqual({ secret: 'auth-secret', expiresIn: '60m' });
    });
  });
});