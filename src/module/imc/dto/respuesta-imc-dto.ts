import { ApiProperty } from '@nestjs/swagger';

export class ImcResponseDTO {
  @ApiProperty({ example: 22.86, description: 'Índice de Masa Corporal calculado' })
  imc: number;

  @ApiProperty({ example: 'Normal', description: 'Categoría según el IMC' })
  categoria: string;
}
