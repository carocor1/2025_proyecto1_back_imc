import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsString, IsInt } from 'class-validator';

export class CreateImcHistorialDto {
  @ApiProperty({
    example: 1.75,
    description: 'Altura de la persona en metros (0.1 - 3)',
    type: Number,
  })
  @IsNumber({}, { message: 'La altura debe ser un número' })
  @Min(0.1)
  @Max(3)
  altura: number;

  @ApiProperty({
    example: 70,
    description: 'Peso de la persona en kg (1 - 500)',
    type: Number,
  })
  @IsNumber({}, { message: 'El peso debe ser un número' })
  @Min(1)
  @Max(500)
  peso: number;

  @ApiProperty({
    example: 22.86,
    description: 'Índice de Masa Corporal calculado',
    type: Number,
  })
  @IsNumber()
  imc: number;

  @ApiProperty({
    example: 'Normal',
    description: 'Categoría del IMC (Bajo peso, Normal, Sobrepeso, Obeso)',
    type: String,
  })
  @IsString()
  categoria: string;

  @ApiProperty({
    example: 1,
    description: 'Identificador único del usuario asociado al historial de IMC',
    type: Number,
  })
  @IsInt()
  @Min(1)
  usuarioId: number;
}
