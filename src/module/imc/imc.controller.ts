import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImcResponseDTO } from './dto/respuesta-imc-dto';
import { AuthGuard, RequestWithUser } from '../../middleware/auth.middleware';

@ApiTags('IMC')
@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) {}

  @Post('calcular')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Calcular IMC',
    description:
      'Calcula el índice de masa corporal y guarda el historial para el usuario autenticado.',
  })
  @ApiResponse({
    status: 201,
    description: 'IMC calculado correctamente',
    type: ImcResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos en el cuerpo de la solicitud',
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async calcular(
    @Body() data: CalcularImcDto,
    @Req() request: RequestWithUser,
  ): Promise<ImcResponseDTO> {
    return this.imcService.calcularImc(data, request.user.id);
  }
}
