import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { ImcHistorialModule } from 'src/imc-historial/imc-historial.module';

@Module({
  imports: [ImcHistorialModule],
  controllers: [ImcController],
  providers: [ImcService],
})
export class ImcModule {}
