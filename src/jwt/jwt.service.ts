import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Payload } from './payload.interface';
@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  generateToken(
    payload: { email: string },
    type: 'refresh' | 'auth' = 'auth', //Es refresh o auth, y si es indefinido asume que es auth
  ): string {
    const secret = this.configService.get<string>(
      type === 'auth' ? 'JWT_AUTH_SECRET' : 'JWT_REFRESH_SECRET',
    );
    const expiresIn = this.configService.get<string>(
      type === 'auth' ? 'JWT_AUTH_EXPIRES_IN' : 'JWT_REFRESH_EXPIRES_IN',
    );
    if (!secret || !expiresIn) {
      throw new Error(`Missing JWT configuration for ${type} token`);
    }
    return sign(payload, secret, { expiresIn });
  }

  refreshToken(refreshToken: string) {
    try {
      const refreshSecret =
        this.configService.get<string>('JWT_REFRESH_SECRET');
      if (!refreshSecret) {
        throw new Error('Missing JWT_REFRESH_SECRET');
      }

      const payload = verify(refreshToken, refreshSecret) as Payload;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = (payload.exp - currentTime) / 60;

      if (timeToExpire < 20) {
        return {
          accessToken: this.generateToken({
            email: payload.email,
          }),
          refreshToken: this.generateToken({ email: payload.email }, 'refresh'),
        };
      }
      return {
        accessToken: this.generateToken({
          email: payload.email,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getPayload(token: string, type: 'refresh' | 'auth' = 'auth'): Payload {
    const secret = this.configService.get<string>(
      type === 'auth' ? 'JWT_AUTH_SECRET' : 'JWT_REFRESH_SECRET',
    );
    if (!secret) {
      throw new Error(`Missing JWT ${type} secret`);
    }
    return verify(token, secret) as Payload;
  }
}
