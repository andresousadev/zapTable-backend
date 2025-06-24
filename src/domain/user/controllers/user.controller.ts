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
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  // TODO only allow admins to do this
  @Post('admin')
  createAdmin(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.makeAdmin(userId);
  }

  @Post('owner')
  createOwner(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('businessId', ParseIntPipe) businessId: number,
  ) {
    return this.userService.makeOwner(userId, businessId);
  }

  @Post('staff')
  createStaff(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('restaurantId', ParseIntPipe) restaurantId: number,
  ) {
    return this.userService.makeStaff(userId, restaurantId);
  }

  // TODO only allow admins to do this
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get(':email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // TODO only allow admins to do this
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
