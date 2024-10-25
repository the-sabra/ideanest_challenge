import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../interface/payload.interface';
import * as bcrypt from 'bcrypt';
@Injectable()
export class Helper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public generateAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get(
        'JWT_ACCESS_EXPIRATION_TIME_IN_MINUTES',
      ),
      secret: this.configService.get('JWT_SECRET'),
    });
  }
  public generateRefreshToken(sign: string): string {
    return this.jwtService.sign(
      { sign },
      {
        expiresIn: this.configService.get(
          'JWT_REFRESH_EXPIRATION_TIME_IN_MINUTES',
        ),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      },
    );
  }

  public hashPassword(password: string): string {
    const saltOrRounds = 10;
    return bcrypt.hashSync(password, saltOrRounds);
  }

  public comparePassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
