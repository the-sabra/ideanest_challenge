import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export enum AccessLevel {
  ADMIN = 'admin',
  USER = 'user',
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    required: true,
    enum: AccessLevel,
    default: AccessLevel.USER,
  })
  access_level: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
