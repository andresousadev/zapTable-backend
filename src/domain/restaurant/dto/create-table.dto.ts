import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { TableStatus } from '../enums/table-status.enum';

export class CreateTableDto {
  @IsNumber()
  @IsNotEmpty()
  tableNumber: number;

  @IsString()
  @IsNotEmpty()
  qrCode: string;

  @IsBoolean()
  @IsNotEmpty()
  active: boolean;

  @IsEnum(TableStatus)
  @IsNotEmpty()
  status: TableStatus;

  @IsNumber()
  @IsNotEmpty()
  restaurantId: number;
}
