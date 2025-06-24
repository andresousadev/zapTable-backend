import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RefreshUserToken } from '../dto/incoming/refresh-user-token.dto';
import { SignInUser } from '../dto/incoming/sign-in-user.dto';
import { AuthService } from '../services/auth.service';
import { AuthResponse, AuthTokens } from '../types/auth.types';
import { LogoutUser } from './../dto/incoming/logout-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@Public()
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
}
