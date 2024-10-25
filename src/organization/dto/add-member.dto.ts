import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class AddMemberDto {
  @IsEmail()
  @ApiProperty({
    description: 'User email',
  })
  user_email: string;
}
