import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { RefreshTokenDto } from '../application/dto/refresh-token.dto';
import { RegisterDto } from '../application/dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }
}
