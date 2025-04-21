import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Admin } from '../entities/admin.entity';
import { EntityRepository } from '@mikro-orm/core';
import { Staff } from '../entities/staff.entity';
import { Owner } from '../entities/owner.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepo: EntityRepository<Owner>,
    @InjectRepository(Admin)
    private readonly adminRepo: EntityRepository<Admin>,
    @InjectRepository(Staff)
    private readonly staffRepo: EntityRepository<Staff>,
  ) {}
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
