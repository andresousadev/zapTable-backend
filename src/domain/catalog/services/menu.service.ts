import { Business } from '@app/domain/business/entities/business.entity';
import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateMenuDto } from '../dto/create-menu.dto';
import { UpdateMenuDto } from '../dto/update-menu.dto';
import { Category } from '../entities/category.entity';
import { Menu } from '../entities/menu.entity';

@Injectable()
export class MenuService {
  private readonly logger = new Logger(MenuService.name, { timestamp: true });

  constructor(
    @InjectRepository(Menu)
    private readonly menuRepo: EntityRepository<Menu>,
    @InjectRepository(Business)
    private readonly businessRepo: EntityRepository<Business>,
    @InjectRepository(Category)
    private readonly categoriesRepo: EntityRepository<Category>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createMenuDto: CreateMenuDto): Promise<Menu> {
    this.logger.log(
      `operation='create', message='creating menu', createMenuDto='${JSON.stringify(createMenuDto)}'`,
    );

    const { businessId, categoryIds } = createMenuDto;

    const validationPromises: Promise<void>[] = [];
    validationPromises.push(
      this.businessRepo.count({ id: businessId }).then((count) => {
        if (count === 0) {
          throw new BadRequestException(
            `Business with id ${businessId} does not exist`,
          );
        }
      }),
    );

    if (categoryIds && categoryIds.length > 0) {
      validationPromises.push(
        this.categoriesRepo
          .count({ id: { $in: categoryIds } })
          .then((count) => {
            if (count !== categoryIds.length) {
              throw new BadRequestException(
                'One or more category IDs are invalid',
              );
            }
          }),
      );
    }

    await Promise.all(validationPromises);

    // TODO add converters
    const business = this.businessRepo.getReference(businessId);
    const categories = categoryIds?.map((id) =>
      this.categoriesRepo.getReference(id),
    ) as Category[];

    const menuEntity = this.menuRepo.create({
      name: createMenuDto.name,
      description: createMenuDto.description,
      photoSrc: createMenuDto.photoSrc,
      active: createMenuDto.active,
      business,
      categories: categories,
    });

    try {
      await this.entityManager.persistAndFlush(menuEntity);

      return menuEntity;
    } catch (error: unknown) {
      this.logger.error(
        `operation='create', message='error while creating menu', createMenuDto={}`,
        createMenuDto,
        error,
      );
      throw error;
    }
  }

  async findAll(): Promise<Menu[]> {
    // TODO Should be paginated on the future
    return this.menuRepo.findAll();
  }

  async findOne(id: number): Promise<Menu> {
    const menu = await this.menuRepo.findOne(id);

    if (!menu) {
      throw new NotFoundException(`Menu with id ${id} does not exist`);
    }

    return menu;
  }

  async update(id: number, updateMenuDto: UpdateMenuDto): Promise<Menu> {
    const currentMenu = await this.menuRepo.findOne(
      { id },
      { populate: ['business', 'categories'] },
    );

    if (!currentMenu) {
      throw new NotFoundException(`Menu with id ${id} not found`);
    }

    try {
      const { businessId, ...basicUpdates } = updateMenuDto;

      Object.assign(currentMenu, basicUpdates);

      if (businessId !== undefined) {
        // TODO understand if makes sense to transfer bussiness, doesnt make sesnse for now
        currentMenu.business = this.businessRepo.getReference(businessId);
      }

      // Handle categories update
      // TODO handle categories updates

      await this.entityManager.flush();
      return currentMenu;
    } catch (error: unknown) {
      this.logger.error(
        `operation='create', message='error while updating menu', updateMenuDto=${JSON.stringify(updateMenuDto)}`,
        error,
      );
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);

    await this.menuRepo.nativeDelete(id);
  }
}
