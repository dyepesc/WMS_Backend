import { Controller, Post, Body, ValidationPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto as PlatformLoginDto } from './dto/login.dto';
import { LoginDto as TenantLoginDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Existing platform admin login endpoint
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: PlatformLoginDto) {
    return this.authService.login({
      email: loginDto.email,
      password: loginDto.password
    });
  }

  // New tenant user login endpoint
  @Post('tenant/login')
  @HttpCode(HttpStatus.OK)
  async tenantLogin(@Body(ValidationPipe) loginDto: TenantLoginDto) {
    return this.authService.login({
      usernameOrEmail: loginDto.usernameOrEmail,
      password: loginDto.password,
      tenantIdentifier: loginDto.tenantIdentifier
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout() {
    // Client-side logout, no server-side action needed for JWT
    return;
  }
}