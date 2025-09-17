import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ImcModule } from './module/imc/imc.module';
import { AppController } from './app.controller';
import { ImcHistorialModule } from './imc-historial/imc-historial.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import * as fs from 'fs';
import * as path from 'path';
import { User } from './users/entities/user.entity';
import { ImcHistorial } from './imc-historial/entities/imc-historial.entity';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, ImcHistorial],
      synchronize: true,
      ssl: {
        ca: process.env.CA_CERT
          ? Buffer.from(process.env.CA_CERT, 'utf-8') // usa la variable de entorno en Render
          : fs.readFileSync(
              path.resolve(
                __dirname,
                '..',
                '..',
                '2025_proyecto1_back_imc',
                'src',
                'config',
                'ca.pem', // fallback local
              ),
            ),
        rejectUnauthorized: true,
      },
    }),
    ImcModule,
    ImcHistorialModule,
    UsersModule,
    JwtModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
