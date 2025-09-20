import { ImcCategoriaStrategy } from './imc-categoria.strategy';

export class ObesoStrategy implements ImcCategoriaStrategy {
  coincide(imc: number): boolean {
    return imc >= 30;
  }
  getCategoria(): string {
    return 'Obeso';
  }
}
