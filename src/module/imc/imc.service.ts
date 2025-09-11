import { Injectable } from '@nestjs/common';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ImcResponseDTO } from './dto/respuesta-imc-dto';
import { CreateImcHistorialDto } from 'src/imc-historial/dto/create-imc-historial.dto';
import { ImcHistorialService } from 'src/imc-historial/imc-historial.service';

@Injectable()
export class ImcService {
  constructor(private readonly imcHistorialService: ImcHistorialService) {}

  async calcularImc(
    data: CalcularImcDto,
    usuarioId: number,
  ): Promise<ImcResponseDTO> {
    const { altura, peso } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100; // Redondeo a 2 decimales

    let categoria: string;
    if (imc < 18.5) {
      categoria = 'Bajo peso';
    } else if (imc < 25) {
      categoria = 'Normal';
    } else if (imc < 30) {
      categoria = 'Sobrepeso';
    } else {
      categoria = 'Obeso';
    }

    const historialDto: CreateImcHistorialDto = {
      altura: data.altura,
      peso: data.peso,
      imc: imcRedondeado,
      categoria,
      usuarioId,
    };

    await this.imcHistorialService.create(historialDto);

    return { imc: imcRedondeado, categoria };
  }
}
