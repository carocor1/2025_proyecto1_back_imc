import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Payload } from './payload.interface';

@Injectable()
export class JwtService {
  constructor(private readonly jwtService: NestJwtService) {}

  // Configuraciones basadas en variables de entorno
  private readonly authConfig = {
    secret: process.env.JWT_AUTH_SECRET || 'authSecret', // Secreto para tokens de autenticación
    expiresIn: process.env.JWT_AUTH_EXPIRES_IN || '15m', // Duración por defecto: 15 minutos
  };

  private readonly refreshConfig = {
    secret: process.env.JWT_REFRESH_SECRET || 'refreshSecret', // Secreto para tokens de refresco
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '1d', // Duración por defecto: 1 día
  };

  // Genera un token JWT (autenticación o refresco) usando la configuración adecuada
  generateToken(payload: { email: string; sub: string }, type: 'auth' | 'refresh' = 'auth'): string {
    const config = type === 'auth' ? this.authConfig : this.refreshConfig;
    return this.jwtService.sign(payload, {
      secret: config.secret,
      expiresIn: config.expiresIn,
    });
  }

  // Refresca los tokens si el token de refresco está próximo a expirar (<20 minutos)
  refreshToken(refreshToken: string): { accessToken: string; refreshToken?: string } {
    try {
      const payload = this.jwtService.verify(refreshToken, { secret: this.refreshConfig.secret }) as Payload;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = (payload.exp - currentTime) / 60; // Calcula tiempo restante en minutos

      if (timeToExpire < 20) {
        // Si quedan menos de 20 minutos, genera nuevos tokens
        return {
          accessToken: this.generateToken({ email: payload.email, sub: payload.sub }, 'auth'),
          refreshToken: this.generateToken({ email: payload.email, sub: payload.sub }, 'refresh'),
        };
      }

      // Si aún tiene más de 20 minutos, solo renueva el access token
      return {
        accessToken: this.generateToken({ email: payload.email, sub: payload.sub }, 'auth'),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token'); // Token inválido
    }
  }

  // Verifica un token y devuelve su payload
  getPayload(token: string, type: 'auth' | 'refresh' = 'auth'): Payload {
    const config = type === 'auth' ? this.authConfig : this.refreshConfig;
    try {
      return this.jwtService.verify(token, { secret: config.secret }) as Payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token'); // Excepción para tokens no válidos
    }
  }
}