import { CreateUserDto } from '@app/auth/dto/incoming/create-user.dto';
import { User } from '@app/domain/user/entities/user.entity';
import { UserService } from '@app/domain/user/services/user.service';
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthResponse, AuthTokens, JwtPayload } from '../types/auth.types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUpUser(createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const user = await this.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    const roles = user.roles.getItems().map((roleEntity) => roleEntity.role);

    return {
      ...tokens,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        roles: roles,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmailWithRoles(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async refreshTokens(
    email: string,
    refreshToken: string,
  ): Promise<AuthTokens> {
    const user = await this.userService.findByEmailWithRoles(email);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException(
        'Access Denied - User with the email or Refresh token does not exist',
      );
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new ForbiddenException(
        'Access Denied - Refresh Token does not match',
      );
    }

    const tokens = await this.generateTokens(user);
    await this.updateRefreshToken(user.id, tokens.refresh_token);

    return tokens;
  }

  async logout(userId: number): Promise<void> {
    // TODO add validation to only logout if is the user
    await this.userService.update(userId, { refreshToken: null });
  }

  async validateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<User | null> {
    const user = await this.userService.findOne(userId);

    if (!user || !user.refreshToken) {
      return null;
    }

    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );
    return refreshTokenMatches ? user : null;
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const roles = user.roles.getItems().map((roleEntity) => roleEntity.role);

    const jwtPayload: JwtPayload = {
      sub: user.id.toString(),
      email: user.email,
      roles: roles,
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AUTH_JWT_ACCESS_SECRET,
        expiresIn: process.env.AUTH_JWT_ACCESS_EXPIRATION,
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AUTH_JWT_REFRESH_SECRET,
        expiresIn: process.env.AUTH_JWT_REFRESH_EXPIRATION,
      }),
    ]);

    return { access_token, refresh_token };
  }

  private async updateRefreshToken(
    userId: number,
    refreshToken: string,
  ): Promise<void> {
    // TODO, should set a env variable for salt iterations
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userService.update(userId, { refreshToken: hashedRefreshToken });
  }
}
