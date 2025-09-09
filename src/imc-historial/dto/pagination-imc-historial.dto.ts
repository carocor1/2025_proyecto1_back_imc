import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationImcHistorialDto {
  @Type(() => Number) //transforma el query string a number
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @Type(() => Number)
  @IsOptional()
  @Min(1)
  page?: number;
}
