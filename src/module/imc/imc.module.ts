import { Module } from '@nestjs/common';
import { ImcService } from './imc.service';
import { ImcController } from './imc.controller';
import { ImcHistorialModule } from '../../imc-historial/imc-historial.module';
import { AuthGuard } from '../../middleware/auth.middleware';
import { JwtModule } from '../../jwt/jwt.module';
import { UsersModule } from '../../users/users.module';
import { BajoPesoStrategy } from './strategies/imc-bajo-peso.strategy';
import { NormalStrategy } from './strategies/imc-normal.strategy';
import { SobrepesoStrategy } from './strategies/imc-sobrepeso.strategy';
import { ObesoStrategy } from './strategies/imc-obeso.strategy';

@Module({
  imports: [ImcHistorialModule, JwtModule, UsersModule],
  controllers: [ImcController],
  providers: [
    ImcService,
    AuthGuard,
    BajoPesoStrategy,
    NormalStrategy,
    SobrepesoStrategy,
    ObesoStrategy,
    {
      provide: 'CATEGORIA_STRATEGIES',
      //crea un array con todas las estrategia y los inyecta bajo el token 'CATEGORIA_STRATEGIES'
      useFactory: (
        bajoPeso: BajoPesoStrategy,
        normal: NormalStrategy,
        sobrepeso: SobrepesoStrategy,
        obeso: ObesoStrategy,
      ) => {
        return [bajoPeso, normal, sobrepeso, obeso];
      },
      inject: [
        BajoPesoStrategy,
        NormalStrategy,
        SobrepesoStrategy,
        ObesoStrategy,
      ],
    },
  ],
})
export class ImcModule {}
