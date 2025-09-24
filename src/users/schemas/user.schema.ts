import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' }) // <- nombre exacto de la colección
export class UserDocument extends Document {
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
