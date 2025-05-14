import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // This is a mock admin user - in production, you would fetch from database
  private readonly mockAdminUser = {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123', // In production, use hashed passwords
    role: 'super_admin',
  };

  async validateUser(email: string, password: string) {
    // In production, validate against database
    if (email === this.mockAdminUser.email && password === this.mockAdminUser.password) {
      const { password, ...result } = this.mockAdminUser;
      return result;
    }
    return null;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
} 