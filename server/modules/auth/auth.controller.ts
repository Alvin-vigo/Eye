import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { RegisterRequest, LoginRequest, UserInfo } from '@shared/api.interface';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterRequest) {
    return this.authService.register(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginRequest): Promise<{ user: UserInfo; token: string }> {
    return this.authService.login(dto);
  }

  @Post('logout')
  async logout(@Headers('x-session-token') token: string) {
    return this.authService.logout(token);
  }

  @Get('me')
  async me(@Headers('x-session-token') token: string): Promise<{ user: UserInfo }> {
    const user = await this.authService.getCurrentUser(token);
    return { user };
  }
}
