import { Module } from '@nestjs/common';
import { ImcHistorialService } from './imc-historial.service';
import { ImcHistorialController } from './imc-historial.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ImcHistorialSchema } from './schemas/imc-historial.schema';
import { ImcHistorialMongoRepository } from './repositories/mongo-historial.repository';
import { ImcHistorialMapper } from './mappers/imc-historial.mapper';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from '../middleware/auth.middleware';
import { JwtModule } from '../jwt/jwt.module';
import { CounterModule } from 'src/counters/counter.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ImcHistorial', schema: ImcHistorialSchema },
    ]),
    UsersModule,
    JwtModule,
    CounterModule,
  ],
  controllers: [ImcHistorialController],
  providers: [
    ImcHistorialService,
    {
      provide: 'IImcHistorialRepository',
      useClass: ImcHistorialMongoRepository,
    },
    ImcHistorialMapper,
    AuthGuard,
  ],
  exports: [ImcHistorialService],
})
export class ImcHistorialModule {}
