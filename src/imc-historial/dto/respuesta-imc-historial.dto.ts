import { ApiProperty } from '@nestjs/swagger';

export class ImcHistorialResponseDTO {
  @ApiProperty({
    example: 1.75,
    description: 'Altura de la persona en metros',
  })
  altura: number;

  @ApiProperty({
    example: 1,
    description: 'Identificador único del cálculo de IMC en el historial',
    required: true,
    type: Number,
  })
  id: number;

  @ApiProperty({
    example: 70,
    description: 'Peso de la persona en kilogramos',
  })
  peso: number;

  @ApiProperty({
    example: 22.86,
    description: 'Índice de Masa Corporal calculado',
  })
  imc: number;

  @ApiProperty({
    example: 'Normal',
    description:
      'Categoría según el IMC (ej: Bajo peso, Normal, Sobrepeso, Obesidad)',
  })
  categoria: string;

  @ApiProperty({
    example: '2025-09-09T12:30:00.000Z',
    description: 'Fecha y hora en que se registró el cálculo',
    type: String, // Swagger lo muestra como string en formato ISO8601
  })
  fechaHora: Date;
}