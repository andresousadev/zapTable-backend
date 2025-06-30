import { OwnerRole } from '@app/domain/user/entities/owner-role.entity';
import { User } from '@app/domain/user/entities/user.entity';
import { Role } from '@app/domain/user/enums/role.enum';
import {
  EntityManager,
  EntityRepository,
  ForeignKeyConstraintViolationException,
  UniqueConstraintViolationException,
  wrap,
} from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { Business } from '../entities/business.entity';
import {
  BusinessByUserIdError,
  BusinessNotFoundError,
} from '../errors/business.error';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepo: EntityRepository<Business>,
    @InjectRepository(User)
    private readonly userRepo: EntityRepository<User>,
    @InjectRepository(OwnerRole)
    private readonly ownerRoleRepo: EntityRepository<OwnerRole>,
    private readonly em: EntityManager,
  ) {}

  async create(createBusinessDto: CreateBusinessDto): Promise<Business> {
    const { ownerId, ...businessProperties } = createBusinessDto;

    return await this.em.transactional(async (em) => {
      try {
        const user = this.userRepo.getReference(ownerId);

        const business = this.businessRepo.create(businessProperties);

        const ownerRole = this.ownerRoleRepo.create({
          user,
          role: Role.OWNER,
        });

        business.owner = ownerRole;
        ownerRole.businesses.add(business);

        await em.persistAndFlush([business, ownerRole]);

        return business;
      } catch (error: unknown) {
        if (error instanceof UniqueConstraintViolationException) {
          throw new BadRequestException(
            `Business with name '${createBusinessDto.name}' already exists`,
          );
        }

        if (error instanceof ForeignKeyConstraintViolationException) {
          const errorMessage = error.message.toLowerCase();
          if (errorMessage.includes('user')) {
            throw new BadRequestException(
              `User with id ${ownerId} does not exist`,
            );
          }
        }

        throw error;
      }
    });
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
