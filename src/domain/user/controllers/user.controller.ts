import { CurrentUser } from '@app/auth/decorators/current-user.decorator';
import { Roles } from '@app/auth/decorators/roles.decorator';
import { BusinessAccessGuard } from '@app/auth/guards/business-access.guard';
import { AuthenticatedUser } from '@app/auth/types/auth.types';
import { Role } from '@app/domain/user/enums/role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get(':email')
  @Roles(Role.ADMIN)
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  // Test endpoint for business access guard
  @Get('business/:businessId/test-access')
  @UseGuards(BusinessAccessGuard)
  @Roles(Role.OWNER, Role.STAFF)
  @ApiOperation({ summary: 'Test business access' })
  @ApiResponse({
    status: 200,
    description: 'Business access granted',
  })
  async testBusinessAccess(
    @CurrentUser() user: AuthenticatedUser,
    @Param('businessId') businessId: string,
  ) {
    return {
      message: 'Business access granted',
      user: {
        id: user.userId,
        email: user.email,
        roles: user.roles,
      },
      businessId,
    };
  }

  // Debug endpoint to show user roles and relationships
  @Get('debug/roles')
  @Roles(Role.ADMIN, Role.OWNER, Role.STAFF)
  @ApiOperation({ summary: 'Debug user roles and relationships' })
  @ApiResponse({
    status: 200,
    description: 'User roles debug information',
  })
  async debugUserRoles(@CurrentUser() user: AuthenticatedUser) {
    const userWithRoles = await this.userService.findByEmailWithRoles(user.email);
    
    if (!userWithRoles) {
      throw new Error('User not found');
    }

    const rolesDebug = userWithRoles.roles.getItems().map(role => ({
      id: role.id,
      role: role.role,
      type: role.constructor.name,
    }));

    return {
      user: {
        id: userWithRoles.id,
        email: userWithRoles.email,
        name: userWithRoles.name,
      },
      roles: rolesDebug,
      totalRoles: rolesDebug.length,
    };
  }

  // @Post('restaurant/:restaurantId/staff')
  // @Roles(Role.OWNER)
  // inviteStaff(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Param('restaurantId', ParseIntPipe) restaurantId: number,
  // ) {
  //   return this.userService.makeStaff(userId, restaurantId);
  // }
}
