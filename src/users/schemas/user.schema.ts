import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocumentType = UserDocument & Document;

@Schema({ collection: 'users' })
export class UserDocument {
  @Prop({ type: Number, required: true })
  _id: number; 

  @Prop({ required: true })
  nombre: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  contraseña: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpiration?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
