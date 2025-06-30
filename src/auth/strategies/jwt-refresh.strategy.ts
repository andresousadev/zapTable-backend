import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../types/auth.types';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // TODO create config service
      secretOrKey: `${process.env.AUTH_JWT_REFRESH_SECRET}`,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.headers
      .get('Authorization')
      ?.replace('Bearer ', '')
      .trim();

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token malformed');
    }

    const user = await this.authService.validateRefreshToken(
      Number(payload.sub),
      refreshToken,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles,
      refreshToken,
    };
  }
}
