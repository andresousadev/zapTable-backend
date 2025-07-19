import { Roles } from '@app/auth/decorators/roles.decorator';
import { BusinessAccessGuard } from '@app/auth/guards/business-access.guard';
import { Role } from '@app/domain/user/enums/role.enum';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from '../dto/inbound/create-product.dto';
import { UpdateProductDto } from '../dto/inbound/update-product.dto';
import { ProductService } from '../services/product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles(Role.OWNER)
  @UseGuards(BusinessAccessGuard)
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  @Get('/business/:businessId')
  @Roles(Role.OWNER, Role.STAFF)
  @UseGuards(BusinessAccessGuard)
  @ApiOperation({ summary: 'All Products for a specific business' })
  @ApiResponse({
    status: 200,
    description: 'Allows user to query all products from a spefic business',
  })
  async findByBusiness(@Param('businessId') id: string) {
    return await this.productService.findByBusinessId(id);
  }

  @Get('/business/:businessId/:id')
  @Roles(Role.OWNER, Role.STAFF)
  @UseGuards(BusinessAccessGuard)
  @ApiOperation({ summary: 'Product for a specific business' })
  @ApiResponse({
    status: 200,
    description: 'Search product by Id for a spefic business',
  })
  async findOne(
    @Param('businessId')
    businessId: string,
    @Param('id')
    id: string,
  ) {
    return await this.productService.findOneInBusiness(id, businessId);
  }

  @Patch(':id')
  @UseGuards(BusinessAccessGuard)
  @Roles(Role.OWNER, Role.STAFF)
  @ApiOperation({ summary: 'Update product information on a given business' })
  @ApiResponse({
    status: 200,
    description: 'Update product information',
  })
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete('/business/:businessId/:id')
  @Roles(Role.OWNER)
  @UseGuards(BusinessAccessGuard)
  async remove(
    @Param('businessId')
    businessId: string,
    @Param('id')
    id: string,
  ) {
    return await this.productService.removeInBusiness(id, businessId);
  }
}
