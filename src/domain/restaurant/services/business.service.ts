import { Injectable } from '@nestjs/common';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Business } from '../entities/business.entity';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/core';
import { User } from '@app/domain/user/entities/user.entity';
import {
  BusinessByUserIdError,
  BusinessNotFoundError,
} from '../errors/business.error';
import { UserNotFoundByIdError } from '@app/domain/user/errors/user.error';
import { OwnerRole } from '@app/domain/user/entities/owner-role.entity';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: EntityRepository<Business>,
    private readonly em: EntityManager,
  ) {}
  async create(createBusinessDto: CreateBusinessDto) {
    const business = new Business();

    const { ownerId, ...properties } = createBusinessDto;

    wrap(business).assign(properties, { onlyProperties: true });

    const user = this.em.getReference(User, ownerId);

    if (user == null) {
      throw new UserNotFoundByIdError(ownerId);
    }

    const ownerRole = new OwnerRole();
    ownerRole.businesses.add(business);
    ownerRole.user = user;

    business.owner = ownerRole;

    await this.businessRepo.getEntityManager().persistAndFlush(business);
  }

  async findAll() {
    return await this.businessRepo.findAll();
  }

  async findOne(id: number) {
    return await this.businessRepo.findOne(id);
  }

  async findByUserId(userid: number) {
    try {
      const businesses = await this.businessRepo.find({
        owner: {
          user: {
            id: +userid,
          },
        },
      });
      return businesses;
    } catch (error) {
      console.error('Error fetching business by owner ID: ', error);
      throw new BusinessByUserIdError(+userid);
    }
  }

  async update(id: number, updateBusinessDto: UpdateBusinessDto) {
    const business = this.businessRepo.getReference(id);

    if (business == null) {
      throw new BusinessNotFoundError(id);
    }

    wrap(business).assign(updateBusinessDto, { onlyProperties: true });

    await this.businessRepo.getEntityManager().persistAndFlush(business);
  }

  async remove(id: number) {
    const business = this.businessRepo.getReference(id);

    if (business == null) {
      throw new BusinessNotFoundError(id);
    }

    await this.businessRepo.getEntityManager().removeAndFlush(business);
  }
}
