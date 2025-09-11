import { CreateImcHistorialDto } from '../dto/create-imc-historial.dto';
import { ImcHistorial } from '../entities/imc-historial.entity';

export interface IImcHistorialRepository {
  create(imcHistorialDto: CreateImcHistorialDto): Promise<ImcHistorial>;
  findAllByUser(usuarioId: number): Promise<ImcHistorial[]>;
  findAllPaginatedByUser(
    page: number,
    limit: number,
    usuarioId: number,
  ): Promise<{
    historiales: ImcHistorial[];
    total: number;
    page: number;
    lastPage: number;
  }>;
}
