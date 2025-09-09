import { Repository } from 'typeorm';
import { ImcHistorial } from '../entities/imc-historial.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateImcHistorialDto } from '../dto/create-imc-historial.dto';
import { IImcHistorialRepository } from './historial-repository.interface';

export class ImcHistorialRepository implements IImcHistorialRepository {
  constructor(
    @InjectRepository(ImcHistorial)
    private imcHistorialRepository: Repository<ImcHistorial>,
  ) {}

  async create(
    createImcHistorialDto: CreateImcHistorialDto,
  ): Promise<ImcHistorial> {
    const historial = this.imcHistorialRepository.create(createImcHistorialDto);
    return await this.imcHistorialRepository.save(historial);
  }

  async findAll(): Promise<ImcHistorial[]> {
    return await this.imcHistorialRepository.find();
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    historiales: ImcHistorial[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    const [historiales, total] = await this.imcHistorialRepository.findAndCount(
      {
        skip: (page - 1) * limit,
        take: limit,
      },
    );

    return {
      historiales,
      total,
      page,
      lastPage: Math.ceil(total / limit), //cant de paginas totales
    };
  }
}
