import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ImcHistorialDocumentType = ImcHistorialDocument & Document;

@Schema({ collection: 'imc_historial' })
export class ImcHistorialDocument {
  @Prop({ type: Number, required: true })
  _id: number;

  @Prop({ type: Number, ref: 'users', required: true })
  userId: number;

  @Prop({ required: true })
  altura: number;

  @Prop({ required: true })
  peso: number;

  @Prop({ required: true })
  imc: number;

  @Prop({ required: true })
  categoria: string;

  @Prop({ default: () => new Date() })
  fechaHora: Date;
}

export const ImcHistorialSchema =
  SchemaFactory.createForClass(ImcHistorialDocument);
