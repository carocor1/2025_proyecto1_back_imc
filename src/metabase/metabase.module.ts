import { Module } from '@nestjs/common';
import { MetabaseController } from './metabase.controller';
import { MetabaseService } from './metabase.service';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from '../middleware/auth.middleware';
import { JwtModule } from '../jwt/jwt.module';

@Module({
  imports: [UsersModule, JwtModule],
  controllers: [MetabaseController],
  providers: [MetabaseService, AuthGuard],
  exports: [MetabaseService],
})
export class MetabaseModule {}
