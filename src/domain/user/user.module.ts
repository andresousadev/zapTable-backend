import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { AdminRole } from './entities/admin-role.entity';
import { StaffRole } from './entities/staff-role.entity';
import { OwnerRole } from './entities/owner-role.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, AdminRole, StaffRole, OwnerRole])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
