import { ImcCategoriaStrategy } from './imc-categoria.strategy';

export class BajoPesoStrategy implements ImcCategoriaStrategy {
  coincide(imc: number): boolean {
    return imc < 18.5;
  }
  getCategoria(): string {
    return 'Bajo peso';
  }
}
