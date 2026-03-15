import { IsEmail, IsNumberString, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  password!: string;

  @IsNumberString()
  organizationId!: string;
}
