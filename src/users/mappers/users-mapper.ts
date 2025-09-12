import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { RespuestaUserDto } from '../dto/respuesta-user.dto';

@Injectable()
export class UsersMapper {
  toResponseDto(user: User): RespuestaUserDto {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
    };
  }
}
