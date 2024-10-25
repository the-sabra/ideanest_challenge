import { ConflictException, Injectable } from '@nestjs/common';
import { Helper } from './provider/helper.provider';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly helper: Helper,
    private readonly userService: UserService,
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

      const refreshToken = this.helper.generateRefreshToken(
        accessToken.split(' ')[2],
      );
      return { accessToken, refreshToken };
    } catch (error) {
      throw error;
    }
  }
}
