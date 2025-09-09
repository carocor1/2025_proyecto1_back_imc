import { Controller, Get, Query } from '@nestjs/common';
import { ImcHistorialService } from './imc-historial.service';
import { PaginationImcHistorialDto } from './dto/pagination-imc-historial.dto';
import { ImcHistorialResponseDTO } from './dto/respuesta-imc-historial.dto';
import { PaginationHistorialResponseDTO } from './dto/respuesta-pagination-imc-historial.dto';

@Controller('historial')
export class ImcHistorialController {
  constructor(private readonly imcHistorialService: ImcHistorialService) {}

  @Get()
  findAll(): Promise<ImcHistorialResponseDTO[]> {
    return this.imcHistorialService.findAll();
  }

  @Get('paginado')
  findAllPaginated(
    @Query() paginationDto: PaginationImcHistorialDto,
  ): Promise<PaginationHistorialResponseDTO> {
    return this.imcHistorialService.findAllPaginated(paginationDto);
  }
}
