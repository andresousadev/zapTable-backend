# Authentication Usage Guide

## Overview

This guide explains how to use the authentication and authorization system in the ZapTable backend.

## Quick Start

### 1. Public Routes

Use the `@Public()` decorator to mark routes that don't require authentication:

```typescript
import { Public } from '@app/auth/decorators';

@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  async login() {
    // This endpoint is public
  }
}
```

### 2. Protected Routes

By default, all routes require authentication. The system will automatically validate JWT tokens.

```typescript
@Controller('users')
export class UserController {
  @Get('profile')
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    // This endpoint requires authentication
    return { user };
  }
}
```

### 3. Role-Based Authorization

Use the `@Roles()` decorator to restrict access based on user roles:

```typescript
import { Roles } from '@app/auth/decorators';
import { Role } from '@app/domain/user/enums/role.enum';

@Controller('admin')
export class AdminController {
  @Roles(Role.ADMIN)
  @Get('dashboard')
  async adminDashboard() {
    // Only admins can access this
  }

  @Roles(Role.ADMIN, Role.OWNER)
  @Get('reports')
  async reports() {
    // Admins and owners can access this
  }
}
```

### 4. Business Access Control

Use the `BusinessAccessGuard` for multi-tenant business access:

```typescript
import { UseGuards } from '@nestjs/common';
import { BusinessAccessGuard } from '@app/auth/guards/business-access.guard';

@Controller('business')
export class BusinessController {
  @UseGuards(BusinessAccessGuard)
  @Roles(Role.OWNER, Role.STAFF)
  @Get(':businessId/data')
  async getBusinessData(@CurrentUser() user: AuthenticatedUser) {
    // User must have access to the specific business
  }
}
```

### 5. Getting Current User

Use the `@CurrentUser()` decorator to access the authenticated user:

```typescript
import { CurrentUser } from '@app/auth/decorators';
import { AuthenticatedUser } from '@app/auth/types/auth.types';

@Controller('profile')
export class ProfileController {
  @Get()
  async getProfile(@CurrentUser() user: AuthenticatedUser) {
    return {
      id: user.userId,
      email: user.email,
      roles: user.roles,
    };
  }
}
```

## Available Roles

- `Role.ADMIN`: System administrator
- `Role.OWNER`: Business owner
- `Role.STAFF`: Staff member

## Environment Variables

Make sure to set these environment variables:

```env
AUTH_JWT_ACCESS_SECRET=your-access-secret
AUTH_JWT_REFRESH_SECRET=your-refresh-secret
AUTH_JWT_ACCESS_EXPIRATION=15m
AUTH_JWT_REFRESH_EXPIRATION=7d
```

## API Endpoints

### Authentication Endpoints

- `POST /auth/login` - User login (public)
- `POST /auth/refresh-token` - Refresh JWT tokens (public)
- `POST /auth/logout` - User logout (authenticated)
- `GET /auth/me` - Get current user info (authenticated)

### Example Usage

```typescript
// Login
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@example.com', password: 'password' })
});

const { access_token, refresh_token, user } = await response.json();

// Use access token for authenticated requests
const profile = await fetch('/auth/me', {
  headers: { 'Authorization': `Bearer ${access_token}` }
});
```

## Error Handling

The system will return appropriate HTTP status codes:

- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `400 Bad Request` - Invalid request data 