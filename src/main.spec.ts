import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder, ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';
import { bootstrap } from './main';

// Mockeo de NestFactory
jest.mock('@nestjs/core', () => ({
  NestFactory: { create: jest.fn() },
}));

// Mockeo completo de Swagger para que los decoradores no fallen
jest.mock('@nestjs/swagger', () => {
  const mockBuilder = {
    setTitle: jest.fn().mockReturnThis(),
    setDescription: jest.fn().mockReturnThis(),
    setVersion: jest.fn().mockReturnThis(),
    addTag: jest.fn().mockReturnThis(),
    build: jest.fn().mockReturnValue({ swaggerConfig: 'mocked' }),
  };
  return {
    DocumentBuilder: jest.fn(() => mockBuilder),
    SwaggerModule: {
      createDocument: jest.fn().mockReturnValue({ swaggerDoc: 'mocked' }),
      setup: jest.fn(),
    },
    ApiProperty: jest.fn(() => () => {}),
    ApiOperation: jest.fn(() => () => {}),
    ApiResponse: jest.fn(() => () => {}),
    ApiTags: jest.fn(() => () => {}),
  };
});

describe('Main bootstrap (unitarias)', () => {
  let mockApp: {
    enableCors: jest.Mock;
    useGlobalPipes: jest.Mock;
    listen: jest.Mock;
    close: jest.Mock;
  };

  beforeEach(() => {
    mockApp = {
      enableCors: jest.fn(),
      useGlobalPipes: jest.fn(),
      listen: jest.fn().mockResolvedValue(undefined),
      close: jest.fn().mockResolvedValue(undefined),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(mockApp);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create the application', async () => {
    await bootstrap();
    expect(NestFactory.create).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should enable CORS', async () => {
    await bootstrap();
    expect(mockApp.enableCors).toHaveBeenCalled();
  });

  it('should configure ValidationPipe', async () => {
    await bootstrap();
    expect(mockApp.useGlobalPipes).toHaveBeenCalled();
    const pipe = mockApp.useGlobalPipes.mock.calls[0][0];
    expect(pipe).toBeInstanceOf(ValidationPipe);
  });

  it('should configure Swagger', async () => {
    await bootstrap();
    expect(DocumentBuilder).toHaveBeenCalled();
    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(mockApp, expect.any(Object));
    expect(SwaggerModule.setup).toHaveBeenCalledWith('api', mockApp, expect.any(Object));
  });

  it('should listen on port 3000', async () => {
    await bootstrap();
    expect(mockApp.listen).toHaveBeenCalledWith(3000);
  });

  it('should throw error if NestFactory.create fails', async () => {
    (NestFactory.create as jest.Mock).mockRejectedValueOnce(new Error('Failed to create app'));
    await expect(bootstrap()).rejects.toThrow('Failed to create app');
  });

  it('should throw error if app.listen fails', async () => {
    mockApp.listen.mockRejectedValueOnce(new Error('Failed to start server'));
    await expect(bootstrap()).rejects.toThrow('Failed to start server');
  });
  
});
