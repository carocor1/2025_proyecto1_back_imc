import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { ImcHistorial } from './imc-historial/entities/imc-historial.entity';

import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './users/schemas/user.schema';
import { ImcHistorialSchema } from './imc-historial/schemas/imc-historial.schema';

import { UsersModule } from './users/users.module';
import { ImcModule } from './module/imc/imc.module';
import { ImcHistorialModule } from './imc-historial/imc-historial.module';
import { JwtModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { MetabaseModule } from './metabase/metabase.module';
import { MailModule } from './mail/mail.module';
import { CounterModule } from './counters/counter.module';

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
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017', {
      dbName: 'proyecto1',
    }),
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'ImcHistorial', schema: ImcHistorialSchema },
    ]),
    UsersModule,
    ImcModule,
    ImcHistorialModule,
    JwtModule,
    AuthModule,
    MetabaseModule,
    MailModule,
    CounterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
