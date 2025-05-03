import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserPersistenceModel>;

@Schema({ timestamps: true, versionKey: false })
export class UserPersistenceModel {
  @Prop({ required: true, type: String, minlength: 3 })
  name: string;

  @Prop({ required: true, type: String, unique: true })
  email: string;

  @Prop({ required: true, type: String })
  passwordHash: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(UserPersistenceModel);

UserSchema.index({ email: 1 }, { unique: true });
