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
import { MetabaseModule } from './metabase/metabase.module';
import { MailerModule } from '@nestjs-modules/mailer';

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
      synchronize: false,
      ssl: {
        ca: process.env.CA_CERT
          ? Buffer.from(process.env.CA_CERT, 'utf-8')
          : fs.readFileSync(
              path.resolve(
                __dirname,
                '..',
                '..',
                '2025_proyecto1_back_imc',
                'src',
                'config',
                'ca.pem',
              ),
            ),
        rejectUnauthorized: true,
      },
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: Number(process.env.MAIL_PORT),
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      },
      defaults: {
        from: `"Calculadora IMC" <${process.env.MAIL_USER}>`,
      },
    }),
    ImcModule,
    ImcHistorialModule,
    UsersModule,
    JwtModule,
    AuthModule,
    MetabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}