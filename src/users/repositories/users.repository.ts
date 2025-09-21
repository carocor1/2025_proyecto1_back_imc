import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { IUsuarioRepository } from './users-repository.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UsuarioRepository implements IUsuarioRepository {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(userData);
      return await this.userRepository.save(user);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el usuario:` + error,
      );
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con ID ${id}. Error:` + error,
      );
    }
  }
  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.userRepository.findOneBy({ email });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con el email ${email}. Error:` + error,
      );
    }
  }

  async update(id: number, updateData: Partial<User>): Promise<UpdateResult> {
    try {
      return await this.userRepository.update(id, updateData);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el usuario con ID ${id}. Error:` + error,
      );
    }
  }

  async guardarTokenReset(
    email: string,
    token: string,
    expiration: Date,
  ): Promise<void> {
    try {
      const user = await this.findByEmail(email);
      if (user) {
        user.passwordResetToken = token;
        ((user.passwordResetExpiration = expiration),
          await this.userRepository.save(user));
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el usuario con email ${email}. Error:` + error,
      );
    }
  }

  async findOneByResetToken(token: string): Promise<User | null> {
    try {
      return await this.userRepository.findOne({
        where: { passwordResetToken: token },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con el token de reset ${token}. Error:` +
          error,
      );
    }
  }

  async updatePassword(id: number, newPassword: string): Promise<void> {
    try {
      const user = await this.findOne(id);
      if (user) {
        user.contraseña = newPassword;
        user.passwordResetToken = null;
        user.passwordResetExpiration = null;
        await this.userRepository.save(user);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la contraseña del usuario con ID ${id}. Error:` +
          error,
      );
    }
  }
}
