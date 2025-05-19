// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto as PlatformLoginDto } from './dto/login.dto';
import { LoginDto as TenantLoginDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Platform admin login
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(ValidationPipe) loginDto: { email: string; password: string },
  ) {
    return this.authService.loginPlatformAdmin(
      loginDto.email,
      loginDto.password,
    );
  }

  // Tenant user login with tenant ID
  @Post('tenant/:tenantId/login')
  @HttpCode(HttpStatus.OK)
  async tenantLogin(
    @Param('tenantId', ParseIntPipe) tenantId: number,
    @Body(ValidationPipe)
    loginDto: { usernameOrEmail: string; password: string },
  ) {
    return this.authService.loginTenantUser(
      loginDto.usernameOrEmail,
      loginDto.password,
      tenantId,
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout() {
    // Client-side logout, no server-side action needed for JWT
    return;
  }
}
