import { UserService } from '@app/domain/user/services/user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Cookies } from '../decorators/cookies.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { CreateUserDto } from '../dto/incoming/create-user.dto';
import { SignInUser } from '../dto/incoming/sign-in-user.dto';
import { AuthService } from '../services/auth.service';
import { AuthenticatedUser, AuthResponse } from '../types/auth.types';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('sign-up')
  @Public()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User basic informations',
  })
  async login(
    @Body() signInDto: SignInUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const loginResponse = await this.authService.login(
      signInDto.email,
      signInDto.password,
    );

    response.cookie('access_token', loginResponse.access_token, {
      path: '/',
      maxAge: 60 * 15 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    response.cookie('refresh_token', loginResponse.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return loginResponse;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT Token' })
  @Post('refresh-token')
  @ApiResponse({
    status: 200,
    description: 'Refreshes User JWT Tokens',
  })
  async refreshTokens(
    @Cookies('refresh_token') refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const authTokens = await this.authService.refreshTokens(refreshToken);

    response.cookie('access_token', authTokens.access_token, {
      path: '/',
      maxAge: 60 * 15 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    response.cookie('refresh_token', authTokens.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout session' })
  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'Logout from session',
  })
  async logout(
    @CurrentUser() user: AuthenticatedUser,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.authService.logout(Number(user.userId));

    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
  }

  @HttpCode(HttpStatus.OK)
  @Public()
  @Get('status')
  checkAuthStatus(
    @Cookies('access_token') accessToken: string,
    @Cookies('refresh_token') refreshToken: string,
  ) {
    return {
      isAuthenticated: !!accessToken,
      hasRefreshToken: !!refreshToken,
    };
  }

  @Get('me')
  @ApiOperation({ summary: 'Get current user information' })
  @ApiResponse({
    status: 200,
    description: 'Current user information with roles',
  })
  async getCurrentUser(@CurrentUser() user: AuthenticatedUser) {
    const userWithRoles = await this.userService.findByEmailWithRoles(
      user.email,
    );

    if (!userWithRoles) {
      throw new Error('User not found');
    }

    const roles = userWithRoles.roles
      .getItems()
      .map((roleEntity) => roleEntity.role);

    return {
      id: userWithRoles.id.toString(),
      email: userWithRoles.email,
      name: userWithRoles.name,
      roles: roles,
    };
  }
}
