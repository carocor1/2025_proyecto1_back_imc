import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { ImcService } from './imc.service';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ImcResponseDTO } from './dto/respuesta-imc-dto';

@ApiTags('IMC')
@Controller('imc')
export class ImcController {
  constructor(private readonly imcService: ImcService) {}

  @Post('calcular')
  @ApiOperation({ summary: 'Calcular IMC', description: 'Calcula el índice de masa corporal y devuelve la categoría' })
  @ApiResponse({ status: 201, description: 'IMC calculado correctamente', type: ImcResponseDTO })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @Post('calcular')
  calcular(@Body(ValidationPipe) data: CalcularImcDto): ImcResponseDTO {
    return this.imcService.calcularImc(data);
  }
}
