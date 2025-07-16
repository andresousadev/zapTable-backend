import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateTableDto {
  @IsNumber()
  @IsNotEmpty()
  tableNumber: number;

  @IsString()
  @IsNotEmpty()
  qrCode: string;

  @IsBoolean()
  @IsNotEmpty()
  isAvailable: boolean;

  @IsUUID()
  @IsNotEmpty()
  restaurantId: string;
}
