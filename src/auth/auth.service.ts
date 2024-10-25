import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Helper } from './provider/helper.provider';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly helper: Helper,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async signUp(signUpDto: SignUpDto) {
    try {
      const { email } = signUpDto;
      const user = await this.userService.findByEmail(email);

      if (user) {
        throw new ConflictException('Email already exists');
      }

      signUpDto.password = this.helper.hashPassword(signUpDto.password);
      await this.userService.create(signUpDto);
      return;
    } catch (error) {
      throw error;
    }
  }

  public async signIn(signInDto: SignInDto) {
    try {
      const { email, password } = signInDto;
      const user = await this.userService.findByEmail(email);

      if (!user) {
        throw new ConflictException('Invalid email or password');
      }

      const isPasswordMatch = this.helper.comparePassword(
        password,
        user.password,
      );

      if (!isPasswordMatch) {
        throw new ConflictException('Invalid email or password');
      }

      const accessToken = this.helper.generateAccessToken({
        email: user.email,
        sub: user.id,
      });

      const refreshToken = this.helper.generateRefreshToken(user.id.toString());

      await this.helper.saveTokenToCache(refreshToken, user.id);

      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }

  public async refreshToken(refreshToken: string) {
    try {
      const userId: string = await this.cacheManager.get(refreshToken);

      if (!userId) {
        throw new ConflictException('Invalid refresh token');
      }

      // ensure the token
      const payload = await this.helper.getRefreshPayload(refreshToken);

      if (payload.sub !== userId.toString()) {
        throw new ConflictException('Invalid refresh token');
      }

      await this.cacheManager.del(refreshToken);

      const user = await this.userService.findById(userId);
      const accessToken = this.helper.generateAccessToken({
        email: user.email,
        sub: user.id,
      });

      const newRefreshToken = this.helper.generateRefreshToken(
        user.id.toString(),
      );

      await this.helper.saveTokenToCache(newRefreshToken, user.id);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw error;
    }
  }

  public async logout(refreshToken: string) {
    try {
      const token = await this.cacheManager.get(refreshToken);

      if (!token) {
        throw new ConflictException('Invalid token');
      }

      await this.cacheManager.del(refreshToken);
      return { message: 'Refresh token revoked successfully.' };
    } catch (error) {
      throw error;
    }
  }
}
