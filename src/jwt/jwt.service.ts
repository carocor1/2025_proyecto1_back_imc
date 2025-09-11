import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { Payload } from './payload.interface';
@Injectable()
export class JwtService {
  // config.ts
  config = {
    auth: {
      secret: 'authSecret',
      expiresIn: '15m',
    },
    refresh: {
      secret: 'refreshSecret',
      expiresIn: '1d',
    },
  };
  generateToken(
    payload: { email: string },
    type: 'refresh' | 'auth' = 'auth', //Es refresh o auth, y si es indefinido asume que es auth
  ): string {
    return sign(payload, this.config[type].secret, {
      expiresIn: this.config[type].expiresIn,
    });
  }

  refreshToken(refreshToken: string) {
    try {
      const payload = verify(
        refreshToken,
        this.config.refresh.secret,
      ) as Payload;
      const currentTime = Math.floor(Date.now() / 1000);
      const timeToExpire = (payload.exp - currentTime) / 60;
      if (timeToExpire < 20) {
        return {
          accessToken: this.generateToken({ email: payload.email }),
          refreshToken: this.generateToken({ email: payload.email }, 'refresh'),
        };
      }
      return {
        accessToken: this.generateToken({ email: payload.email }),
      };
    } catch (error) {
      throw new UnauthorizedException()
    }
  }

  getPayload(token: string, type: 'refresh' | 'auth' = 'auth') {
    return verify(token,this.config[type].secret)
  }
}
