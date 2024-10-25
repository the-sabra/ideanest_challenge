import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { Helper } from './provider/helper.provider';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        global: true,
      }),
      imports: [ConfigModule],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, Helper],
})
export class AuthModule {}
