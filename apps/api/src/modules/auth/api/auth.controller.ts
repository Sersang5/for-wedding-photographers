import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { LoginDto } from '../application/dto/login.dto';
import { RefreshTokenDto } from '../application/dto/refresh-token.dto';
import { RegisterDto } from '../application/dto/register.dto';
import { GoogleAuthUser } from '../application/interfaces/google-auth-user.interface';
import { GoogleAuthGuard } from '../infrastructure/guards/google-auth.guard';

type RedirectResponse = {
  redirect: (url: string) => void;
};

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

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {
    return {
      success: true,
    };
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() req: { user: GoogleAuthUser },
    @Res() res: RedirectResponse,
  ) {
    const authResponse = await this.authService.loginWithGoogle(req.user);
    const redirectUrl = this.authService.buildFrontendAuthRedirectUrl(authResponse);
    res.redirect(redirectUrl);
  }
}