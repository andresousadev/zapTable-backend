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
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { BusinessService } from '../services/business.service';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  create(@Body() createBusinessDto: CreateBusinessDto) {
    return this.businessService.create(createBusinessDto);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.businessService.findAll();
  }

  @Get('/user')
  @Roles(Role.ADMIN, Role.OWNER, Role.STAFF)
  findByUser(@CurrentUser() user: AuthenticatedUser) {
    return this.businessService.findBusinessWithRestaurantDetailsByUserId(
      Number(user.userId),
    );
  }

  @Get(':businessId')
  @UseGuards(BusinessAccessGuard)
  @Roles(Role.ADMIN, Role.OWNER, Role.STAFF)
  findOne(@Param('businessId', ParseIntPipe) id: number) {
    return this.businessService.findOne(id);
  }

  @Patch(':businessId')
  @UseGuards(BusinessAccessGuard)
  @Roles(Role.ADMIN, Role.OWNER)
  update(
    @Param('businessId', ParseIntPipe) id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(':businessId')
  @UseGuards(BusinessAccessGuard)
  @Roles(Role.OWNER)
  remove(@Param('businessId', ParseIntPipe) id: number) {
    return this.businessService.remove(+id);
  }
}
