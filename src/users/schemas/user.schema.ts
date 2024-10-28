import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  // @Prop({ required: true })
  // _id: string;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: string; // Roles: USER, ADMIN

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;
}

export const UserSchema = SchemaFactory.createForClass(User);
