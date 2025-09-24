// src/scripts/migrate-postgres-to-mongo.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ImcHistorial } from '../imc-historial/entities/imc-historial.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { ImcHistorialDocument } from '../imc-historial/schemas/imc-historial.schema';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Repositorios Postgres
    const dataSource = app.get(DataSource);
    const userRepo = dataSource.getRepository(User);
    const historialRepo = dataSource.getRepository(ImcHistorial);

    // Modelos Mongo
    const mongoUserModel = app.get<Model<UserDocument>>(getModelToken('UserDocument'));
    const mongoHistorialModel = app.get<Model<ImcHistorialDocument>>(getModelToken('ImcHistorialDocument'));

    // Traemos usuarios desde Postgres
    const users = await userRepo.find();
    console.log(`Usuarios encontrados en Postgres: ${users.length}`);

    if (users.length === 0) {
      console.log('❌ No se encontraron usuarios. Verifica tu conexión a Postgres.');
      return;
    }

    for (const u of users) {
      console.log(`\nMigrando usuario: ${u.email}`);

      // Evitar duplicados
      let mongoUser = await mongoUserModel.findOne({ email: u.email });
      if (!mongoUser) {
        mongoUser = await mongoUserModel.create({
          nombre: u.nombre,
          email: u.email,
          contraseña: u.contraseña,
          passwordResetToken: u.passwordResetToken,
          passwordResetExpiration: u.passwordResetExpiration,
        });
        console.log(`✅ Usuario insertado en Mongo con _id: ${mongoUser._id}`);
      } else {
        console.log(`⚠️ Usuario ya existe en Mongo: ${u.email}`);
      }

      // Traemos historiales del usuario
      const historiales = await historialRepo.find({ where: { usuario: u }, relations: ['usuario'] });
      console.log(`  Historiales encontrados en Postgres: ${historiales.length}`);

      if (historiales.length > 0) {
        const historialDocs = historiales.map(h => ({
          userId: mongoUser._id,
          altura: h.altura,
          peso: h.peso,
          imc: h.imc,
          categoria: h.categoria,
          fechaHora: h.fechaHora,
        }));

        await mongoHistorialModel.insertMany(historialDocs, { ordered: false });
        console.log(`  ✅ ${historialDocs.length} historiales insertados en Mongo`);
      } else {
        console.log('  ⚠️ No se encontraron historiales para este usuario');
      }
    }

    console.log('\n🎉 Migración completada con éxito!');
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
