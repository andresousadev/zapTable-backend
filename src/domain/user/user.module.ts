import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { AdminRole } from './entities/admin-role.entity';
import { OwnerRole } from './entities/owner-role.entity';
import { StaffRole } from './entities/staff-role.entity';
import { User } from './entities/user.entity';
import { UserRoleService } from './services/user-role.service';
import { UserService } from './services/user.service';

@Module({
  imports: [MikroOrmModule.forFeature([User, AdminRole, StaffRole, OwnerRole])],
  controllers: [UserController],
  providers: [UserService, UserRoleService],
})
export class UserModule {}
