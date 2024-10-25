import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Payload } from '../interface/payload.interface';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class Helper {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public generateAccessToken(payload: Payload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get(
        'JWT_ACCESS_EXPIRATION_TIME_IN_MINUTES',
      ),
      secret: this.configService.get('JWT_SECRET'),
    });
  }
  public generateRefreshToken(id: string): string {
    return this.jwtService.sign(
      { sub: id },
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

  public async saveTokenToCache(key: string, value: any) {
    return await this.cacheManager.set(
      key,
      value,
      parseInt(
        this.configService
          .getOrThrow<string>('JWT_REFRESH_EXPIRATION_TIME_IN_MINUTES')
          .split('m')[0],
      ) *
        60 *
        1000,
    ); // minutes to milliseconds
  }

  public async getRefreshPayload(refreshToken: string): Promise<Payload> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });
      return payload;
    } catch (error) {
      throw error;
    }
  }
}
