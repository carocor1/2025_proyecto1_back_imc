import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ImcModule } from './module/imc/imc.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ImcService } from './module/imc/imc.service';
import { ImcController } from './module/imc/imc.controller';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should load ImcModule correctly', () => {
    const imcModule = module.get(ImcModule);
    expect(imcModule).toBeDefined();
  });

  it('should provide AppService correctly', () => {
    const appService = module.get<AppService>(AppService);
    expect(appService).toBeDefined();
    expect(appService).toBeInstanceOf(AppService);
  });

  it('should provide AppController correctly', () => {
    const appController = module.get<AppController>(AppController);
    expect(appController).toBeDefined();
    expect(appController).toBeInstanceOf(AppController);
  });

  it('should provide ImcService correctly', () => {
    const imcService = module.get<ImcService>(ImcService);
    expect(imcService).toBeDefined();
    expect(imcService).toBeInstanceOf(ImcService);
  });

  it('should provide ImcController correctly', () => {
    const imcController = module.get<ImcController>(ImcController);
    expect(imcController).toBeDefined();
    expect(imcController).toBeInstanceOf(ImcController);
  });


  it('should throw error when trying to access ImcService without ImcModule', async () => {
    const invalidModule = await Test.createTestingModule({
      imports: [], 
      controllers: [AppController],
      providers: [AppService],
    }).compile();
    expect(() => invalidModule.get(ImcService)).toThrow(); 
  });

  it('should throw error when AppService is not provided', async () => {
    await expect(
      Test.createTestingModule({
        imports: [ImcModule],
        controllers: [AppController],
        providers: [], 
      }).compile(),
    ).rejects.toThrow();
  });


 
});