import { User } from '@app/domain/user/entities/user.entity';
import { UserModule } from '@app/domain/user/user.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guards/auth.guard';
import { BusinessAccessGuard } from './guards/business-access.guard';
import { RolesGuard } from './guards/roles.guard';
import { AuthService } from './services/auth.service';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.AUTH_JWT_ACCESS_SECRET,
      signOptions: {
        expiresIn: process.env.AUTH_JWT_ACCESS_EXPIRATION || '15m',
      },
    }),
    MikroOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    BusinessAccessGuard,
    JwtRefreshStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService, BusinessAccessGuard],
})
export class AuthModule {}
