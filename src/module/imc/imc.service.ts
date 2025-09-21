import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CalcularImcDto } from './dto/calcular-imc-dto';
import { ImcResponseDTO } from './dto/respuesta-imc-dto';
import { CreateImcHistorialDto } from '../../imc-historial/dto/create-imc-historial.dto';
import { ImcHistorialService } from '../../imc-historial/imc-historial.service';
import { ImcCategoriaStrategy } from './strategies/imc-categoria.strategy';

@Injectable()
export class ImcService {
  constructor(
    private readonly imcHistorialService: ImcHistorialService,
    @Inject('CATEGORIA_STRATEGIES')
    private categoriaStrategies: ImcCategoriaStrategy[],
  ) {}

  async calcularImc(
    data: CalcularImcDto,
    usuarioId: number,
  ): Promise<ImcResponseDTO> {
    const { altura, peso } = data;
    const imc = peso / (altura * altura);
    const imcRedondeado = Math.round(imc * 100) / 100; // Redondeo a 2 decimales
    //Determina la categoria de acuerdo al imcRedondeado. Verifica cual de ellas devuelve true.
    const categoria = this.categoriaStrategies
      .find((estrategia) => estrategia.coincide(imcRedondeado))
      ?.getCategoria();
    if (!categoria) {
      throw new BadRequestException(
        'No se encontró una categoría para el IMC calculado',
      );
    }
    const historialDto: CreateImcHistorialDto = {
      altura: altura,
      peso: peso,
      imc: imcRedondeado,
      categoria,
      usuarioId,
    };

    await this.imcHistorialService.create(historialDto);

    return { imc: imcRedondeado, categoria };
  }
}
