import { CreateImcHistorialDto } from '../dto/create-imc-historial.dto';
import { ImcHistorial } from '../entities/imc-historial.entity';

export interface IImcHistorialRepository {
  create(imcHistorialDto: CreateImcHistorialDto): Promise<ImcHistorial>;
  findAll(): Promise<ImcHistorial[]>;
  findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{
    historiales: ImcHistorial[];
    total: number;
    page: number;
    lastPage: number;
  }>;
}
