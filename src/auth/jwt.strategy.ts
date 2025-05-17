import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'your-secret-key', // In production, use environment variable
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      roles: Array.isArray(payload.roles) ? payload.roles : [payload.role], // Handle both single role and array
      tenant_id: payload.tenant_id,
    };
  }
} 