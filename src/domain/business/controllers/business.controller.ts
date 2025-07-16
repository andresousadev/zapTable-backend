import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateBusinessDto } from '../dto/create-business.dto';
import { UpdateBusinessDto } from '../dto/update-business.dto';
import { BusinessService } from '../services/business.service';

@Controller('business')
export class BusinessController {
  constructor(private readonly businessService: BusinessService) {}

  @Post()
  async create(@Body() createBusinessDto: CreateBusinessDto) {
    return await this.businessService.create(createBusinessDto);
  }

  @Get()
  async findAll() {
    return await this.businessService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.businessService.findOne(id);
  }

  @Get(':userid')
  async findByUser(@Param('userid', ParseIntPipe) userid: number) {
    return await this.businessService.findByUserId(userid);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ) {
    return await this.businessService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.businessService.remove(+id);
  }
}
