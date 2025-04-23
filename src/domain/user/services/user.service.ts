import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Admin } from '../entities/admin.entity';
import { EntityRepository, wrap } from '@mikro-orm/core';
import { Staff } from '../entities/staff.entity';
import { Owner } from '../entities/owner.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PasswordUtil } from '@app/shared/utils/password.util';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepo: EntityRepository<Owner>,
    @InjectRepository(Admin)
    private readonly adminRepo: EntityRepository<Admin>,
    @InjectRepository(Staff)
    private readonly staffRepo: EntityRepository<Staff>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
  ) {}
  async createOwner(createUserDto: CreateUserDto) {
    const owner = new Owner();

    await this.initializeUser(createUserDto, owner);
    await this.ownerRepo.getEntityManager().persistAndFlush(owner);
  }

  async createAdmin(createUserDto: CreateUserDto) {
    const admin = new Admin();

    await this.initializeUser(createUserDto, admin);
    await this.adminRepo.getEntityManager().persistAndFlush(admin);
  }

  async createStaff(createUserDto: CreateUserDto) {
    const staff = new Staff();

    await this.initializeUser(createUserDto, staff);
    await this.staffRepo.getEntityManager().persistAndFlush(staff);
  }

  async findAll() {
    return await this.userRepo.findAll();
  }

  async findOne(id: number) {
    return await this.userRepo.findOne(id);
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({ email });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOneOrFail(id);

    wrap(user).assign(updateUserDto, { onlyProperties: true });

    this.userRepo.merge(user);
  }

  async remove(id: number) {
    const user = await this.userRepo.findOneOrFail(id);

    await this.userRepo.getEntityManager().removeAndFlush(user);
  }

  async initializeUser(
    createUserDto: CreateUserDto,
    user: User,
  ): Promise<User | null> {
    const { password, ...properties } = createUserDto;

    const existing = this.findByEmail(properties.email);

    if (existing != null) {
      throw new ConflictException('Email already being used');
    }

    wrap(user).assign(properties, { onlyProperties: true });

    user.password = await PasswordUtil.hash(password);

    return user;
  }
}
