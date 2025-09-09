import { Expose, Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { ImcHistorialResponseDTO } from './respuesta-imc-historial.dto';

export class PaginationHistorialResponseDTO {
  @Expose()
  @Type(() => ImcHistorialResponseDTO)
  historiales: ImcHistorialResponseDTO[];

  @Expose()
  @IsInt()
  total: number;

  @Expose()
  page: number;

  @Expose()
  lastPage: number;
}
