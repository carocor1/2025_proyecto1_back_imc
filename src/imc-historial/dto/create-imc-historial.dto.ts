import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsString, IsDate } from 'class-validator';

export class CreateImcHistorialDto {
  @ApiProperty({
    example: 1.75,
    description: 'Altura de la persona en metros (0.1 - 3)',
  })
  @IsNumber()
  @Min(0.1)
  @Max(3)
  altura: number;

  @ApiProperty({
    example: 70,
    description: 'Peso de la persona en kg (1 - 500)',
  })
  @IsNumber()
  @Min(1)
  @Max(500)
  peso: number;

  @ApiProperty({
    example: 22.86,
    description: 'Índice de Masa Corporal calculado',
  })
  @IsNumber()
  imc: number;

  @ApiProperty({
    example: 'Normal',
    description: 'Categoría del IMC (Ej: Normal, Sobrepeso)',
  })
  @IsString()
  categoria: string;
}
