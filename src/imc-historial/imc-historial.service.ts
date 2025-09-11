import { Inject, Injectable } from '@nestjs/common';
import { CreateImcHistorialDto } from './dto/create-imc-historial.dto';
import { IImcHistorialRepository } from './repositories/historial-repository.interface';
import { PaginationImcHistorialDto } from './dto/pagination-imc-historial.dto';
import { ImcHistorialResponseDTO } from './dto/respuesta-imc-historial.dto';
import { ImcHistorialMapper } from './mappers/imc-historial.mapper';
import { PaginationHistorialResponseDTO } from './dto/respuesta-pagination-imc-historial.dto';

@Injectable()
export class ImcHistorialService {
  constructor(
    @Inject('IImcHistorialRepository')
    private readonly imcHistorialRepository: IImcHistorialRepository,
    private readonly imcHistorialMapper: ImcHistorialMapper,
  ) {}

  async create(
    createImcHistorialDto: CreateImcHistorialDto,
  ): Promise<ImcHistorialResponseDTO> {
    return this.imcHistorialMapper.toResponseDto(
      await this.imcHistorialRepository.create(createImcHistorialDto),
    );
  }

  async findAll(usuarioId: number): Promise<ImcHistorialResponseDTO[]> {
    return this.imcHistorialMapper.toResponseDtos(
      await this.imcHistorialRepository.findAllByUser(usuarioId),
    );
  }

  async findAllPaginated(
    paginationMarcaDto: PaginationImcHistorialDto,
    usuarioId: number,
  ): Promise<PaginationHistorialResponseDTO> {
    const { limit = 5, page = 1 } = paginationMarcaDto;
    return this.imcHistorialMapper.toResponsePaginationDto(
      await this.imcHistorialRepository.findAllPaginatedByUser(
        page,
        limit,
        usuarioId,
      ),
    );
  }
}
