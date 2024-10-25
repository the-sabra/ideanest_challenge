import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateOrganizationDto {
  @MinLength(3)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the organization',
    type: String,
    minLength: 3,
  })
  name: string;

  @MinLength(10)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Description of the organization',
    type: String,
    minLength: 10,
  })
  description: string;
}
