import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class AcceptStaffInviteDto {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;
} 