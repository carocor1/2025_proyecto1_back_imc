import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { IUsuarioRepository } from './repositories/users-repository.interface';
import { UsersMapper } from './mappers/users-mapper';
import { RespuestaUserDto } from './dto/respuesta-user.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject('IUsuarioRepository')
    private readonly usuarioRepository: IUsuarioRepository,
    private readonly usuarioMapper: UsersMapper,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
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
    if (updateUserDto.nombre && updateUserDto.nombre.trim() !== '') {
      updates.nombre = updateUserDto.nombre;
    }
    if (updateUserDto.email && updateUserDto.email.trim() !== '') {
      updates.email = updateUserDto.email;
    }
    if (Object.keys(updates).length === 0) {
      throw new BadRequestException(
        'No se proporcionaron campos válidos para actualizar',
      );
    }
    if (updates.email && updates.email !== (await this.findMe(id)).email) {
      const existingUser = await this.usuarioRepository.findByEmail(
        updates.email,
      );
      if (existingUser) {
        throw new ConflictException('El email ya está en uso');
      }
    }
    await this.usuarioRepository.update(id, updates);
    return await this.findOne(id);
  }

  async findByEmail(email: string): Promise<User | null> {
   return await this.usuarioRepository.findByEmail(email);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usuarioRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 3600000); //1 hora.
    await this.usuarioRepository.guardarTokenReset(email, token, expiration);
    const resetUrl = `${this.configService.get(
      'FRONTEND_URL',
    )}/reset-password?token=${token}`;

    await this.mailService.sendPasswordReset(email, user.nombre, resetUrl);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await this.usuarioRepository.findOneByResetToken(token);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }
    if (
      !user.passwordResetExpiration ||
      user.passwordResetExpiration < new Date()
    ) {
      throw new BadRequestException('Token inválido o expirado');
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.usuarioRepository.updatePassword(user.id, hashedPassword);
  }
}
 