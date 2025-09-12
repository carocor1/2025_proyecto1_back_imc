import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsuarioRepository } from './repositories/users.repository';
import { ImcHistorial } from '../imc-historial/entities/imc-historial.entity';
import { User } from './entities/user.entity';

const userMock: User = {
  id: 1,
  nombre: 'Alejo',
  email: 'alejo@gmail.com',
  contraseña: 'contraseña123',
  imcHistorial: [] as ImcHistorial[],
};

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<UsuarioRepository>;

  beforeEach(async () => {
    const repoMock: Partial<jest.Mocked<UsuarioRepository>> = {
      create: jest.fn().mockResolvedValue(userMock),
      findOne: jest.fn().mockResolvedValue(userMock),
      update: jest.fn().mockResolvedValue(userMock),
      findByEmail: jest.fn().mockResolvedValue(userMock),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UsuarioRepository, useValue: repoMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(UsuarioRepository) as jest.Mocked<UsuarioRepository>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should call repository and return user', async () => {
    const dto = {
      nombre: 'Alejo',
      email: 'alejo@gmail.com',
      contraseña: 'contraseña123',
    };
    const result = await service.create(dto as any);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(result).toEqual(userMock);
  });

  it('findOne should call repository and return user', async () => {
    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(userMock);
  });

  it('update should call repository.update and repository.findOne', async () => {
    const dto = { nombre: 'Nuevo' };
    const result = await service.update(1, dto as any);
    expect(repo.update).toHaveBeenCalledWith(1, dto);
    expect(repo.findOne).toHaveBeenCalledWith(1);
    expect(result).toEqual(userMock);
  });

  it('findByEmail should call repository and return user', async () => {
    const result = await service.findByEmail('alejo@gmail.com');
    expect(repo.findByEmail).toHaveBeenCalledWith('alejo@gmail.com');
    expect(result).toEqual(userMock);
  });
});
