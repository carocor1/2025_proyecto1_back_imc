import { ImcCategoriaStrategy } from './imc-categoria.strategy';

export class SobrepesoStrategy implements ImcCategoriaStrategy {
  coincide(imc: number): boolean {
    return imc >= 25 && imc < 30;
  }
  getCategoria(): string {
    return 'Sobrepeso';
  }
}
