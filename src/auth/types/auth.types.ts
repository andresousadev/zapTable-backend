import { UserRole } from '@app/domain/user/entities/user-role.entity';
import { Role } from '@app/domain/user/enums/role.enum';

// JWT abbreviates claim names (iat instead of issuedAt) for size optimizations
// I personally disagree but let's stick to conventions
export interface JwtPayload {
  sub: string; //userId
  email: string;
  roles: Role[];
  iat?: number; //issuedAt
  exp?: number;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse extends AuthTokens {
  user: {
    id: string;
    email: string;
    name: string;
    roles: Role[];
  };
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  roles: Role[];
  roleEntities?: UserRole[];
}
