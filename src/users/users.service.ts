import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUsuarioRepository } from './repositories/users-repository.interface';
import { UsersMapper } from './mappers/users-mapper';
import { RespuestaUserDto } from './dto/respuesta-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly usuarioMapper: UsersMapper,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usuarioRepository.create(createUserDto);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.usuarioRepository.findOne(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async findMe(id: number): Promise<RespuestaUserDto> {
    const user = await this.usuarioRepository.findOne(id);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return this.usuarioMapper.toResponseDto(user);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<RespuestaUserDto> {
    const updates: Partial<User> = {};
    // Filtrar campos vacíos, null o undefined
    if (updateUserDto.nombre && updateUserDto.nombre.trim() !== '') {
      updates.nombre = updateUserDto.nombre;
    }
    if (updateUserDto.email && updateUserDto.email.trim() !== '') {
      updates.email = updateUserDto.email;
    }
    // Verificar si hay algo para actualizar
    if (Object.keys(updates).length === 0) {
      throw new BadRequestException(
        'No se proporcionaron campos válidos para actualizar',
      );
    }
    const user = await this.findMe(id);
    // Verificar si el nuevo email ya está en uso (si se proporciona)
    if (updates.email && updates.email !== user.email) {
      const existingUser = await this.usuarioRepository.findByEmail(
        updates.email,
      );
      if (existingUser) {
        throw new ConflictException('El email ya está en uso');
      }
    }

    // Actualizar solo los campos proporcionados
    await this.usuarioRepository.update(id, updates);
    return await this.findOne(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usuarioRepository.findByEmail(email);
  }
}
