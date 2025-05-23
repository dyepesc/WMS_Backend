import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // Keep existing mock admin user for platform admin authentication
  private readonly mockAdminUser = {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123', // In production, use hashed passwords
    role: 'super_admin',
  };

  // Existing method for platform admin validation
  async validatePlatformAdmin(email: string, password: string) {
    if (
      email === this.mockAdminUser.email &&
      password === this.mockAdminUser.password
    ) {
      const { password, ...result } = this.mockAdminUser;
      return result;
    }
    return null;
  }

  // New method for tenant user validation
  async validateTenantUser(usernameOrEmail: string, password: string, tenantId: number) {
    const user = await this.userRepository.createQueryBuilder('user')
      .where('user.tenant_id = :tenantId', { tenantId })
      .andWhere('(user.username = :usernameOrEmail OR user.email = :usernameOrEmail)', 
        { usernameOrEmail })
      .getOne();

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Existing login method for platform admin
  async loginPlatformAdmin(email: string, password: string) {
    const user = await this.validatePlatformAdmin(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  // New login method for tenant users
  async loginTenantUser(usernameOrEmail: string, password: string, tenantId: number) {
    const user = await this.validateTenantUser(usernameOrEmail, password, tenantId);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { 
      sub: user.id, 
      email: user.email,
      role: [user.role],
      tenant_id: tenantId
    };

    return {
      accessToken: this.jwtService.sign(payload),
      tokenType: 'Bearer',
      expiresIn: 3600,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        roles: [user.role],
        tenantId: tenantId
      }
    };
  }

  // Main login method that handles both platform admin and tenant user login
  async login(loginData: {
    email?: string;
    usernameOrEmail?: string;
    password: string;
    tenantIdentifier?: string;
  }) {
    // If it's a platform admin login attempt (using email)
    if (loginData.email) {
      return this.loginPlatformAdmin(loginData.email, loginData.password);
    }

    // If it's a tenant user login attempt (using usernameOrEmail)
    if (loginData.usernameOrEmail) {
      return this.loginTenantUser(
        loginData.usernameOrEmail,
        loginData.password,
        loginData.tenantIdentifier ? parseInt(loginData.tenantIdentifier) : 0
      );
    }

    throw new UnauthorizedException('Invalid login credentials format');
  }
}
