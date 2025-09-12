import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '../jwt/jwt.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

export interface RequestWithUser extends Request {
  user: User;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request: RequestWithUser = context.switchToHttp().getRequest();
      const token = request.headers.authorization;
      if (!token) {
        throw new UnauthorizedException('El token no existe');
      }
      const payload = this.jwtService.getPayload(token);
      if (!payload) {
        throw new UnauthorizedException('Token inválido');
      }
      if (!payload.sub) {
        throw new UnauthorizedException(
          'El payload del token no contiene el ID del usuario',
        );
      }
      const user = await this.userService.findOne(Number(payload.sub));
      if (!user) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException('No autorizado');
    }
  }
}
