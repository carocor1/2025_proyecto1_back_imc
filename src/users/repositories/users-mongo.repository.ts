import { Model } from 'mongoose';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument } from '../schemas/user.schema';
import { IUsuarioRepository } from './users-repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UsersMapper } from '../mappers/users-mapper';
import { CounterService } from '../../counters/counter.service';

@Injectable()
export class UsuarioMongoRepository implements IUsuarioRepository {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private readonly mapper: UsersMapper,
    private readonly counterService: CounterService,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    try {
      const nextId = await this.counterService.getNextSequence('users');
      const userDoc = new this.userModel({ ...userData, _id: nextId });
      const saved = await userDoc.save();
      return this.mapper.toEntity(saved);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el usuario: ${error}`,
      );
    }
  }

  async findOne(id: number): Promise<User | null> {
    try {
      const doc = await this.userModel.findById(id).exec();
      return doc ? this.mapper.toEntity(doc) : null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con ID ${id}: ${error}`,
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const doc = await this.userModel.findOne({ email }).exec();
      return doc ? this.mapper.toEntity(doc) : null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar el usuario con email ${email}: ${error}`,
      );
    }
  }

  async update(id: number, updateData: Partial<User>): Promise<any> {
    try {
      return await this.userModel.updateOne({ _id: id }, updateData).exec();
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar el usuario con ID ${id}: ${error}`,
      );
    }
  }

  async guardarTokenReset(email: string, token: string, expiration: Date) {
    try {
      await this.userModel.updateOne(
        { email },
        { passwordResetToken: token, passwordResetExpiration: expiration },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al guardar token de reset para email ${email}: ${error}`,
      );
    }
  }

  async findOneByResetToken(token: string): Promise<User | null> {
    try {
      const doc = await this.userModel
        .findOne({ passwordResetToken: token })
        .exec();
      return doc ? this.mapper.toEntity(doc) : null;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al buscar usuario con token ${token}: ${error}`,
      );
    }
  }

  async updatePassword(id: number, newPassword: string) {
    try {
      await this.userModel.updateOne(
        { _id: id },
        {
          contraseña: newPassword,
          passwordResetToken: null,
          passwordResetExpiration: null,
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al actualizar la contraseña del usuario con ID ${id}: ${error}`,
      );
    }
  }
}
