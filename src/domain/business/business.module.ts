import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { OwnerRole } from '../user/entities/owner-role.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { BusinessController } from './controllers/business.controller';
import { Business } from './entities/business.entity';
import { BusinessService } from './services/business.service';

@Module({
  imports: [MikroOrmModule.forFeature([Business, User, OwnerRole]), UserModule],
  controllers: [BusinessController],
  providers: [BusinessService],
})
export class BusinessModule {}
