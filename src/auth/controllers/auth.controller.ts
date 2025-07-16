import { UserService } from '@app/domain/user/services/user.service';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { CreateUserDto } from '../dto/incoming/create-user.dto';
import { RefreshUserToken } from '../dto/incoming/refresh-user-token.dto';
import { SignInUser } from '../dto/incoming/sign-in-user.dto';
import { AuthService } from '../services/auth.service';
import {
  AuthenticatedUser,
  AuthResponse,
  AuthTokens,
} from '../types/auth.types';
import { LogoutUser } from './../dto/incoming/logout-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('sign-up')
  @Public()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'User Login' })
  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'User basic informations',
  })
  async login(@Body() signInDto: SignInUser): Promise<AuthResponse> {
    return await this.authService.login(signInDto.email, signInDto.password);
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
    @Body() refreshUserTokenDto: RefreshUserToken,
  ): Promise<AuthTokens> {
    return await this.authService.refreshTokens(
      refreshUserTokenDto.email,
      refreshUserTokenDto.refreshToken,
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Logout session' })
  @Post('logout')
  @ApiResponse({
    status: 200,
    description: 'Logout from session',
  })
  async logout(@Body() logoutUserDto: LogoutUser): Promise<void> {
    await this.authService.logout(logoutUserDto.userId);
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
