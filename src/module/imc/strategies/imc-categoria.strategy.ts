export interface ImcCategoriaStrategy {
  //verifica si el imc calculado corresponde a dicha categoria.
  coincide(imc: number): boolean;
  //devuelve el nombre de la categoria.
  getCategoria(): string;
}
