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
  firstname: string;

  @Prop({ required: true })
  lastname: string;

  @Prop()
  fullName?: string;
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  country: string;

  @Prop()
  address: string;

  @Prop()
  profilePicture: string;

  @Prop({ required: true })
  password: string;

  // @Prop()
  // otp: string;

  // @Prop()
  // otpExpiration: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: string; // Roles: USER, ADMIN

  // @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  // user?: User;
  @Prop({ default: null })
  resetPasswordToken?: string;

  @Prop({ default: null })
  resetPasswordExpires?: Date;

  // Add the `_id` field explicitly
  readonly _id: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
