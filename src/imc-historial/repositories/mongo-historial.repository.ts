import { Injectable, InternalServerErrorException, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateImcHistorialDto } from '../dto/create-imc-historial.dto';
import { IImcHistorialRepository } from './historial-repository.interface';
import { ImcHistorialDocument } from '../schemas/imc-historial.schema';
import { ImcHistorialMapper } from '../mappers/imc-historial.mapper';
import { ImcHistorial } from '../entities/imc-historial.entity';
import { getModelToken } from '@nestjs/mongoose';
import { CounterService } from 'src/counters/counter.service';

@Injectable()
export class ImcHistorialMongoRepository implements IImcHistorialRepository {
  constructor(
    @Inject(getModelToken('ImcHistorial'))
    private readonly historialModel: Model<ImcHistorialDocument>,
    private readonly mapper: ImcHistorialMapper,
    private readonly counterService: CounterService,
  ) {}

    async create(dto: CreateImcHistorialDto): Promise<ImcHistorial> {
        try {
            const nextId = await this.counterService.getNextSequence('imc_historial');
        const doc = await this.historialModel.create({
            _id: nextId,
            userId: dto.usuarioId,
            altura: dto.altura,
            peso: dto.peso,
            imc: dto.imc,
            categoria: dto.categoria,
            fechaHora: new Date(),
        });
         const saved = await doc.save(); // <- mejor que create
        return this.mapper.toEntity(saved);} catch (error) {
            throw new InternalServerErrorException(`Error al crear historial: ${error}`);}
    }

    async findAllByUser(usuarioId: number): Promise<ImcHistorial[]> {
        try {
        const docs = await this.historialModel
            .find({ userId: usuarioId })
            .sort({ fechaHora: -1 })
            .exec();
        return this.mapper.toEntities(docs);
        } catch (error) {
        throw new InternalServerErrorException(`Error al buscar historiales: ${error}`);
        }
    }

    async findAllPaginatedByUser(page: number, limit: number, usuarioId: number): Promise<{
        historiales: ImcHistorial[];
        total: number;
        page: number;
        lastPage: number;
    }> {
        try {
        const skip = (page - 1) * limit;

        const [docs, total] = await Promise.all([
            this.historialModel
            .find({ userId: usuarioId })
            .sort({ fechaHora: -1 })
            .skip(skip)
            .limit(limit)
            .exec(),
            this.historialModel.countDocuments({ userId: usuarioId }),
        ]);

        return {
            historiales: this.mapper.toEntities(docs),
            total,
            page,
            lastPage: Math.ceil(total / limit),
        };
        } catch (error) {
        throw new InternalServerErrorException(`Error al buscar historiales paginados: ${error}`);
        }
    }
}
