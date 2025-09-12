import { Repository } from 'typeorm';
import { ImcHistorial } from '../entities/imc-historial.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateImcHistorialDto } from '../dto/create-imc-historial.dto';
import { IImcHistorialRepository } from './historial-repository.interface';
import { InternalServerErrorException } from '@nestjs/common';

export class ImcHistorialRepository implements IImcHistorialRepository {
  constructor(
    @InjectRepository(ImcHistorial)
    private imcHistorialRepository: Repository<ImcHistorial>,
  ) {}

  async create(
    createImcHistorialDto: CreateImcHistorialDto,
  ): Promise<ImcHistorial> {
    try {
      const historial = this.imcHistorialRepository.create({
        ...createImcHistorialDto,
        usuario: { id: createImcHistorialDto.usuarioId },
      });
      return await this.imcHistorialRepository.save(historial);
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al crear el historial:` + error,
      );
    }
  }

  async findAllByUser(usuarioId: number): Promise<ImcHistorial[]> {
    try {
      return await this.imcHistorialRepository.find({
        where: { usuario: { id: usuarioId } }, //busca los que pertenecen al usuario enviado como parámetro
        order: { fechaHora: 'DESC' }, // Ordena de forma descendente
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al encontrar los historiales del usuario con ID ${usuarioId}. Error:` +
          error,
      );
    }
  }

  async findAllPaginatedByUser(
    page: number,
    limit: number,
    usuarioId: number,
  ): Promise<{
    historiales: ImcHistorial[];
    total: number;
    page: number;
    lastPage: number;
  }> {
    try {
      const [historiales, total] =
        await this.imcHistorialRepository.findAndCount({
          where: { usuario: { id: usuarioId } },
          order: { fechaHora: 'DESC' },
          skip: (page - 1) * limit,
          take: limit,
        });

      return {
        historiales,
        total,
        page,
        lastPage: Math.ceil(total / limit), //cant de paginas totales
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Error al encontrar los historiales del usuario con ID ${usuarioId} paginados. Error:` +
          error,
      );
    }
  }
}
