import { IsEmail, IsString } from 'class-validator';

export class RegisterDto {
  @IsString()
  organizationName: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
