import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { ImcHistorialModule } from 'src/imc-historial/imc-historial.module';
import { AuthGuard } from 'src/middleware/auth.middleware';
import { JwtModule } from 'src/jwt/jwt.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ImcHistorialModule, JwtModule, UsersModule],
  controllers: [ImcController],
  providers: [ImcService, AuthGuard],
})
export class ImcModule {}
