import { Expose, Type } from 'class-transformer';
import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ImcHistorialResponseDTO } from './respuesta-imc-historial.dto';

export class PaginationHistorialResponseDTO {
  @ApiProperty({
    description: 'Lista de historiales de IMC del usuario',
    type: [ImcHistorialResponseDTO],
  })
  @Type(() => ImcHistorialResponseDTO)
  historiales: ImcHistorialResponseDTO[];

  @ApiProperty({
    description: 'Número total de historiales disponibles para el usuario',
    type: Number,
    example: 3,
  })
  @IsInt({ message: 'El total debe ser un número entero' })
  total: number;

  @ApiProperty({
    description: 'Número de la página actual',
    type: Number,
    example: 1,
  })
  @IsInt({ message: 'La página debe ser un número entero' })
  page: number;

  @ApiProperty({
    description: 'Número de la última página disponible',
    type: Number,
    example: 2,
  })
  @Expose()
  @IsInt({ message: 'La última página debe ser un número entero' })
  lastPage: number;
}
