import { PartialType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { CreateUserDto } from '../../../auth/dto/incoming/create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  refreshToken?: string | null;
}
