import { Request } from 'express';

export interface RequestUser {
  id: number;
  tenantId: number;
  email: string;
  roles: string[];
  // Add any other user properties that are set during authentication
}

export interface RequestWithUser extends Request {
  user: RequestUser;
} 