import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { ImcHistorial } from '../imc-historial/entities/imc-historial.entity';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../users/schemas/user.schema';
import { ImcHistorialDocument } from '../imc-historial/schemas/imc-historial.schema';
import { CounterService } from '../counters/counter.service';

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

    // Counter service
    const counterService = app.get(CounterService);

    // Traer usuarios de Postgres
    const users = await userRepo.find();
    console.log(`Usuarios encontrados en Postgres: ${users.length}`);
    if (users.length === 0) {
      console.log('No hay usuarios para migrar');
      return;
    }

    // Calcular maxUserId
    const maxUserId = users.length > 0 ? Math.max(...users.map(u => u.id)) : 0;
    await counterService.initializeCounter('users', maxUserId);

    // Traer todos los historiales para calcular maxHistId
    const allHistorials = await historialRepo.find();
    const maxHistId = allHistorials.length > 0 ? Math.max(...allHistorials.map(h => h.id)) : 0;
    await counterService.initializeCounter('imc_historial', maxHistId);

    for (const u of users) {
      const userId = u.id;
      let mongoUser = await mongoUserModel.findOne({ _id: userId });

      if (!mongoUser) {
        const emailExist = await mongoUserModel.findOne({ email: u.email });
        if (emailExist) {
          console.log(`Conflicto: El email ${u.email} ya existe en Mongo con ID ${emailExist._id}, pero se intenta usar ${userId}. Saltando este usuario.`);
          continue;
        }

        try {
          mongoUser = await mongoUserModel.create({
            _id: userId,
            nombre: u.nombre,
            email: u.email,
            contraseña: u.contraseña,
            passwordResetToken: u.passwordResetToken,
            passwordResetExpiration: u.passwordResetExpiration,
          });
          console.log(`Usuario migrado: ${u.email} con ID ${userId}`);
        } catch (error) {
          console.error(`Error al migrar usuario ${u.email}:`, error);
          continue;
        }
      } else {
        console.log(`Usuario ya existe en Mongo: ${u.email} con ID ${userId}`);
      }

      // Migrar historiales
      const historiales = await historialRepo.find({ where: { usuario: { id: u.id } } });
      for (const h of historiales) {
        const existingH = await mongoHistorialModel.findOne({ _id: h.id });
        if (!existingH) {
          try {
            await mongoHistorialModel.create({
              _id: h.id,
              userId: userId,
              altura: h.altura,
              peso: h.peso,
              imc: h.imc,
              categoria: h.categoria,
              fechaHora: h.fechaHora,
            });
            console.log(`Historial migrado para usuario ${u.email}, ID ${h.id}`);
          } catch (error) {
            console.error(`Error al migrar historial ID ${h.id} para usuario ${u.email}:`, error);
          }
        } else {
          console.log(`Historial ya existe en Mongo: ID ${h.id} para usuario ${u.email}`);
        }
      }
    }

    console.log('Migración completada ✅');

  } catch (error) {
    console.error('Error en migración:', error);
  } finally {
    await app.close();
  }
}

bootstrap();