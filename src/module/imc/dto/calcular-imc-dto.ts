import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Max, Min } from 'class-validator';

export class CalcularImcDto {
  @ApiProperty({
    example: 1.75,
    description: 'Altura de la persona en metros (0.1 - 3)',
  })
  @IsNumber()
  @Min(0.1) // Altura mínima razonable
  @Max(3) // Altura máxima razonable
  altura: number;

  @ApiProperty({
    example: 70,
    description: 'Peso de la persona en kg (1 - 500)',
  })
  @IsNumber()
  @Min(1) // Peso mínimo razonable
  @Max(500) // Peso máximo razonable
  peso: number;
}
