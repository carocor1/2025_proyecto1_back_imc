import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { ImcHistorialModule } from '../../imc-historial/imc-historial.module';
import { AuthGuard } from '../../middleware/auth.middleware';
import { JwtModule } from '../../jwt/jwt.module';
import { UsersModule } from '../../users/users.module';

@Module({
  imports: [ImcHistorialModule, JwtModule, UsersModule],
  controllers: [ImcController],
  providers: [ImcService, AuthGuard],
})
export class ImcModule {}
