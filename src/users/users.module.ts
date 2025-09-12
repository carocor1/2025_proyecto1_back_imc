import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioRepository } from './repositories/users.repository';
import { UsersMapper } from './mappers/users-mapper';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioRepository,
    },
    UsersMapper,
  ],
  exports: [UsersService, UsersModule],
})
export class UsersModule {}
