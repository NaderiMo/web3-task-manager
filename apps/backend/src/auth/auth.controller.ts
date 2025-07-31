import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { AuthService, AuthRequest, AuthResponse } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('nonce/:wallet')
  async getNonce(
    @Param('wallet') wallet: string,
  ): Promise<{ message: string }> {
    const message = await this.authService.generateNonce(wallet);
    return { message };
  }

  @Post('authenticate')
  async authenticate(@Body() authRequest: AuthRequest): Promise<AuthResponse> {
    return this.authService.authenticate(authRequest);
  }
}
