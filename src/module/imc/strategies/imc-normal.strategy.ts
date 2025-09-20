import { ImcCategoriaStrategy } from './imc-categoria.strategy';

export class NormalStrategy implements ImcCategoriaStrategy {
  coincide(imc: number): boolean {
    return imc >= 18.5 && imc < 25;
  }
  getCategoria(): string {
    return 'Normal';
  }
}
