import { Injectable } from '@nestjs/common';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ImcResponseDTO } from './dto/respuesta-imc-dto';

@Injectable()
export class ImcService {
  calcularImc(data: CalcularImcDto): ImcResponseDTO {
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

    return { imc: imcRedondeado, categoria };
  }
}
