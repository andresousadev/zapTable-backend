import { IsEmail, IsOptional, IsString } from 'class-validator';

export class InviteStaffDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;
} 