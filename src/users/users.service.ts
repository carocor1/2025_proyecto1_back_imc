import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsuarioRepository } from './repositories/usuario.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsuarioRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.create(createUserDto);
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User | null> {
    const body = { ...updateUserDto };
    await this.usersRepository.update(id, body);
    return await this.usersRepository.findOne(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.usersRepository.findByEmail(email);
  }
}
