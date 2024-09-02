import { IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  name: string;
}
