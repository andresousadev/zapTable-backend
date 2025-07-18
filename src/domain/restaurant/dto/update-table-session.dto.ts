import { PartialType } from '@nestjs/mapped-types';
import { CreateTableSessionDto } from './create-table-session.dto';
import { IsBoolean, IsDateString, IsOptional } from 'class-validator';

export class UpdateTableSessionDto extends PartialType(CreateTableSessionDto) {
  @IsDateString()
  @IsOptional()
  endTime?: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
