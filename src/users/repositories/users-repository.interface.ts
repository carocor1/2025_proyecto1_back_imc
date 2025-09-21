import { UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';

export interface IUsuarioRepository {
  findOne(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(userData: CreateUserDto): Promise<User>;
  update(id: number, updateData: Partial<User>): Promise<UpdateResult>;
  guardarTokenReset(
    email: string,
    token: string,
    expiration: Date,
  ): Promise<void>;
  findOneByResetToken(token: string): Promise<User | null>;
  updatePassword(id: number, newPassword: string): Promise<void>;
}
