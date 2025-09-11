import { Module } from '@nestjs/common';
import { ImcHistorialService } from './imc-historial.service';
import { ImcHistorialController } from './imc-historial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcHistorial } from './entities/imc-historial.entity';
import { ImcHistorialRepository } from './repositories/historial.repository';
import { ImcHistorialMapper } from './mappers/imc-historial.mapper';
import { UsersModule } from 'src/users/users.module';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [TypeOrmModule.forFeature([ImcHistorial]), UsersModule, JwtModule],
  controllers: [ImcHistorialController],
  providers: [
    ImcHistorialService,
    {
      provide: 'IImcHistorialRepository',
      useClass: ImcHistorialRepository,
    },
    ImcHistorialMapper,
    AuthGuard,
  ],
  exports: [ImcHistorialService],
})
export class ImcHistorialModule {}
