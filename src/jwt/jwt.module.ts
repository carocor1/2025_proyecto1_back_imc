import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { JwtService } from './jwt.service';

@Module({
  imports: [
    NestJwtModule.register({
      secret: process.env.JWT_AUTH_SECRET || 'authSecret',
      signOptions: { expiresIn: '15m' }, // Configuración de expiración para token
    }),
  ],
  providers: [JwtService], 
  exports: [JwtService, NestJwtModule],
})
export class JwtModule {}