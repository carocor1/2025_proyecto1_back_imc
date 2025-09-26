import { Injectable } from '@nestjs/common';
import { ImcHistorial } from '../entities/imc-historial.entity';
import { ImcHistorialResponseDTO } from '../dto/respuesta-imc-historial.dto';
import { PaginationHistorialResponseDTO } from '../dto/respuesta-pagination-imc-historial.dto';
import { ImcHistorialDocument } from '../schemas/imc-historial.schema';
import { User } from '../../users/entities/user.entity';

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

 
  toEntity(doc: ImcHistorialDocument): ImcHistorial {

    const historial = new ImcHistorial();
    historial.id = doc._id as unknown as number;
    historial.altura = doc.altura;
    historial.peso = doc.peso;
    historial.imc = doc.imc;
    historial.categoria = doc.categoria;
    historial.fechaHora = doc.fechaHora;

    if (doc.userId) {
      const user = new User();
      user.id = doc.userId as unknown as number;
      historial.usuario = user;
    }

    return historial;
  }

  toEntities(docs: ImcHistorialDocument[]): ImcHistorial[] {
    return docs.map((doc) => this.toEntity(doc));
  }
}
