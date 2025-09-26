import { Injectable } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { RespuestaUserDto } from '../dto/respuesta-user.dto';
import { UserDocument } from '../schemas/user.schema';

@Injectable()
export class UsersMapper {
  toResponseDto(user: User): RespuestaUserDto {
    return {
      id: user.id,
      nombre: user.nombre,
      email: user.email,
    };
  }


  toEntity(doc: UserDocument): User {
    const user = new User();
    user.id = doc._id as unknown as number; 
    user.nombre = doc.nombre;
    user.email = doc.email;
    user.contraseña = doc.contraseña;
    user.passwordResetToken = doc.passwordResetToken ?? null;
    user.passwordResetExpiration = doc.passwordResetExpiration ?? null;
    user.imcHistorial = []; 
    return user;
  }
}
