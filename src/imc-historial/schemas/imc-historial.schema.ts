
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ collection: 'imc_historial' }) 
export class ImcHistorialDocument extends Document {
  @Prop({ type: Types.ObjectId, ref: 'users', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  altura: number;

  @Prop({ required: true })
  peso: number;

  @Prop({ required: true })
  imc: number;

  @Prop({ required: true })
  categoria: string;

  @Prop({ default: Date.now })
  fechaHora: Date;
}

export const ImcHistorialSchema = SchemaFactory.createForClass(ImcHistorialDocument);
