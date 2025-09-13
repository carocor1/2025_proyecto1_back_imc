import 'reflect-metadata';
import { bootstrap } from './main';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';

describe('Main bootstrap', () => {
  it('should bootstrap with mocked NestFactory and Swagger', async () => {
    const mockApp = {
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
    };

    jest.spyOn(NestFactory, 'create').mockResolvedValue(mockApp as any);
    jest.spyOn(SwaggerModule, 'createDocument').mockReturnValue({} as any);
    jest.spyOn(SwaggerModule, 'setup').mockImplementation();

    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalled();
    expect(mockApp.enableCors).toHaveBeenCalled();
    expect(mockApp.useGlobalPipes).toHaveBeenCalled();
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
    expect(SwaggerModule.createDocument).toHaveBeenCalled();
    expect(SwaggerModule.setup).toHaveBeenCalled();
  });
});