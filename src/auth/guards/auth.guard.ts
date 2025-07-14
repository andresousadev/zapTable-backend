import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtPayload } from '../types/auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);

    if (!token) {
      throw new UnauthorizedException('Access token required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: process.env.AUTH_JWT_ACCESS_SECRET,
      });

      // Attach user to request
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.user = {
        userId: payload.sub,
        email: payload.email,
        roles: payload.roles,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid access token', error);
    }

    return true;
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return request?.cookies?.access_token;
  }
}
