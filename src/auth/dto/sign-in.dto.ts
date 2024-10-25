import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of a user',
    type: String,
    required: true,
    example: 'test@test.com',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'The password of a user',
    type: String,
    required: true,
  })
  password: string;
}
