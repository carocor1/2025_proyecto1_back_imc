import { IsNumber, Max, Min } from 'class-validator';

export class CalcularImcDto {
  @IsNumber()
  @Min(0.1) // Altura mínima razonable
  @Max(3) // Altura máxima razonable
  altura: number;

  @IsNumber()
  @Min(1) // Peso mínimo razonable
  @Max(500) // Peso máximo razonable
  peso: number;
}
