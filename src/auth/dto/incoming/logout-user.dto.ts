import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class LogoutUser {
  @ApiProperty()
  @IsNumber()
  userId: number;
}
