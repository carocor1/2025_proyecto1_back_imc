import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';
import { Payload } from './payload.interface';
@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  generateToken(
    payload: { email: string; sub: number },
    type: 'refresh' | 'auth' = 'auth', //Es refresh o auth, y si es indefinido asume que es auth
  ): string {
    const { secret, expiresIn } = this.getJwtConfig(type);
    return sign(payload, secret, { expiresIn });
  }

  refreshToken(refreshToken: string) {
    try {
      const { secret } = this.getJwtConfig('refresh');
      const payload = verify(refreshToken, secret) as Payload;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = (payload.exp - currentTime) / 60;

      if (timeToExpire < 20) {
        return {
          accessToken: this.generateToken({
            email: payload.email,
            sub: payload.sub,
          }),
          refreshToken: this.generateToken(
            { email: payload.email, sub: payload.sub },
            'refresh',
          ),
        };
      }
      return {
        accessToken: this.generateToken({
          email: payload.email,
          sub: payload.sub,
        }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  getPayload(token: string, type: 'refresh' | 'auth' = 'auth'): Payload {
    const { secret } = this.getJwtConfig(type);
    return verify(token, secret) as Payload;
  }

  private getJwtConfig(type: 'refresh' | 'auth') {
    const secret = this.configService.get<string>(
      type === 'auth' ? 'JWT_AUTH_SECRET' : 'JWT_REFRESH_SECRET',
    );
    const expiresIn = this.configService.get<string>(
      type === 'auth' ? 'JWT_AUTH_EXPIRES_IN' : 'JWT_REFRESH_EXPIRES_IN',
    );
    if (!secret) {
      throw new Error(`Missing JWT ${type} secret`);
    }
    return { secret, expiresIn };
  }
}
