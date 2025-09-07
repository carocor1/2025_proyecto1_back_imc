import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilita CORS para el frontend
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  
  // Configuración básica de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de IMC')
    .setDescription('Calculadora de Índice de Masa Corporal con NestJS y Swagger')
    .setVersion('1.0')
    .addTag('IMC')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
if (process.env.NODE_ENV !== 'test') {
  bootstrap();
}