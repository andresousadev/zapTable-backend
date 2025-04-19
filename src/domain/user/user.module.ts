import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { Admin } from './entities/admin.entity';
import { Staff } from './entities/staff.entity';
import { Owner } from './entities/owner.entity';

@Module({
  imports: [MikroOrmModule.forFeature([User, Admin, Staff, Owner])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
