import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';

@Schema({
  timestamps: true,
})
export class Organization {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  description: string;

  @Prop({
    type: [{ type: String, ref: User.name }],
    required: true,
  })
  organization_members: string[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
