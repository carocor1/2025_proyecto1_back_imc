import { Injectable } from '@nestjs/common';
import { ImcHistorial } from '../entities/imc-historial.entity';
import { ImcHistorialResponseDTO } from '../dto/respuesta-imc-historial.dto';
import { PaginationHistorialResponseDTO } from '../dto/respuesta-pagination-imc-historial.dto';

@Injectable()
export class ImcHistorialMapper {
  toResponseDto(imcHistorial: ImcHistorial): ImcHistorialResponseDTO {
    return {
      altura: imcHistorial.altura,
      peso: imcHistorial.peso,
      imc: imcHistorial.imc,
      categoria: imcHistorial.categoria,
      fechaHora: imcHistorial.fechaHora,
      id: imcHistorial.id,
    };
  }

  toResponseDtos(historiales: ImcHistorial[]): ImcHistorialResponseDTO[] {
    return historiales.map((historial) => this.toResponseDto(historial));
  }

  toResponsePaginationDto(paginated: {
    historiales: ImcHistorial[];
    total: number;
    page: number;
    lastPage: number;
  }): PaginationHistorialResponseDTO {
    return {
      historiales: this.toResponseDtos(paginated.historiales),
      total: paginated.total,
      page: paginated.page,
      lastPage: paginated.lastPage,
    };
  }
}
