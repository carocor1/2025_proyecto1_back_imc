import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from './repositories/usuario.repository';
import { JwtService } from 'src/jwt/jwt.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService, UsuarioRepository],
  exports: [UsersService, UsersModule],
})
export class UsersModule {}
