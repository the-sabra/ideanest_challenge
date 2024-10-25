import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'refresh token',
    example: 'token',
  })
  @IsJWT()
  @IsNotEmpty()
  refreshToken: string;
}
