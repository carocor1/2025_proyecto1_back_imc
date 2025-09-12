import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ImcHistorialService } from './imc-historial.service';
import { PaginationImcHistorialDto } from './dto/pagination-imc-historial.dto';
import { ImcHistorialResponseDTO } from './dto/respuesta-imc-historial.dto';
import { PaginationHistorialResponseDTO } from './dto/respuesta-pagination-imc-historial.dto';
import { AuthGuard, RequestWithUser } from '../middleware/auth.middleware';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('historial')
export class ImcHistorialController {
  constructor(private readonly imcHistorialService: ImcHistorialService) {}

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Obtener historial de IMC para el usuario logueado',
    description:
      'Devuelve todos los historiales de IMC del usuario autenticado, ordenados por fecha descendente.',
  })
  @ApiResponse({
    status: 200,
    description: 'Historiales obtenidos correctamente',
    type: [ImcHistorialResponseDTO],
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  findAll(@Req() request: RequestWithUser): Promise<ImcHistorialResponseDTO[]> {
    return this.imcHistorialService.findAll(request.user.id);
  }

  @Get('paginado')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Obtener historial de IMC paginado',
    description:
      'Devuelve los historiales de IMC del usuario autenticado con paginación.',
  })
  @ApiResponse({
    status: 200,
    description: 'Historiales paginados obtenidos correctamente',
    type: PaginationHistorialResponseDTO,
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @UseGuards(AuthGuard)
  @Get('paginado')
  findAllPaginated(
    @Query() paginationDto: PaginationImcHistorialDto,
    @Req() request: RequestWithUser,
  ): Promise<PaginationHistorialResponseDTO> {
    return this.imcHistorialService.findAllPaginated(
      paginationDto,
      request.user.id,
    );
  }
}
