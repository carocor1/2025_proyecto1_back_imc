import { Module } from '@nestjs/common';
import { ImcHistorialService } from './imc-historial.service';
import { ImcHistorialController } from './imc-historial.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImcHistorial } from './entities/imc-historial.entity';
import { ImcHistorialRepository } from './repositories/historial.repository';
import { ImcHistorialMapper } from './mappers/imc-historial.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([ImcHistorial])],
  controllers: [ImcHistorialController],
  providers: [
    ImcHistorialService,
    {
      provide: 'IImcHistorialRepository',
      useClass: ImcHistorialRepository,
    },
    ImcHistorialMapper,
  ],
  exports: [ImcHistorialService],
})
export class ImcHistorialModule {}
