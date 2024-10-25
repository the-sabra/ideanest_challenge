import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import {
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthInterceptor } from 'src/interceptor/auth.interceptor';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('authentication')
@Controller()
@UseInterceptors(AuthInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Sign Up user' })
  @ApiCreatedResponse({
    description: 'User created successfully.',
  })
  @ApiConflictResponse({
    description: 'user or email already exists',
    example: { message: 'User already exists' },
  })
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Sign In user' })
  @ApiResponse({
    status: 200,
    description: 'return tokens',
    example: {
      accessToken: 'token',
      refreshToken: 'token',
      message: 'success',
    },
  })
  @ApiConflictResponse({
    description: 'Invalid email or password',
    example: { message: 'Invalid email or password' },
  })
  signin(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh token' })
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 200,
    description: 'return tokens',
    example: {
      accessToken: 'token',
      refreshToken: 'token',
      message: 'success',
    },
  })
  @ApiConflictResponse({
    description: 'Invalid token',
    example: { message: 'Invalid token' },
  })
  refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken.refreshToken);
  }
}
