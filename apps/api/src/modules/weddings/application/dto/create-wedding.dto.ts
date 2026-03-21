import {
  IsDateString,
  IsEmail,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateWeddingDto {
  @IsString()
  @MinLength(2)
  name1!: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  lastName1?: string;

  @IsString()
  @MinLength(2)
  name2!: string;

  @IsString()
  @IsOptional()
  @MinLength(2)
  lastName2?: string;

  @IsEmail()
  @IsOptional()
  email1?: string;

  @IsEmail()
  @IsOptional()
  email2?: string;

  @IsString()
  @IsOptional()
  phone1?: string;

  @IsString()
  @IsOptional()
  phone2?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsDateString()
  weddingDate!: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsNumberString()
  @IsOptional()
  packId?: string;
}
