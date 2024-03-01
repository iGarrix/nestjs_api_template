import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { LoginDto } from 'src/users/dto/login.dto';
import { RegisterDto } from 'src/users/dto/register.dto';
import { AuthService } from './auth.service';
import { JwtAuth } from './decorators/auth.decorator';
import { SessionUser } from './decorators/sessionuser.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @JwtAuth()
  @Get('session')
  async getSession(@SessionUser('email') email: string) {
    return await this.authService.getUserSessionAsync(email);
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('login')
  async login(@Body() body: LoginDto) {
    return await this.authService.loginAsync(body);
  }

  @HttpCode(201)
  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return await this.authService.registerAsync(body);
  }

  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @Post('refresh-token')
  async generateNewToken(@Body() dto: RefreshTokenDto) {
    const response = await this.authService.refreshTokenAsync(
      dto.accessToken,
      dto.refreshToken,
    );
    return response;
  }

  @HttpCode(200)
  @Post('logout')
  @JwtAuth()
  async logout(@SessionUser('email') email: string) {
    try {
      await this.authService.logoutAsync(email);
      return true;
    } catch (error) {
      return false;
    }
  }
}
