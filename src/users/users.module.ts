import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsuarioMongoRepository } from './repositories/users-mongo.repository';
import { UsersMapper } from './mappers/users-mapper';
import { AuthModule } from '../auth/auth.module';
import { MailModule } from '../mail/mail.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserDocument, UserSchema } from './schemas/user.schema';
import { CounterModule } from '../counters/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    AuthModule,
    MailModule,
    CounterModule, // <-- Importar módulo que exporta CounterService
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'IUsuarioRepository',
      useClass: UsuarioMongoRepository,
    },
    UsersMapper,
    // NO hace falta poner CounterService acá, ya lo inyecta desde el módulo
  ],
  exports: [UsersService],
})
export class UsersModule {}
