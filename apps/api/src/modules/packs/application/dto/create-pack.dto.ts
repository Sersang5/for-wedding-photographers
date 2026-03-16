import { IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class CreatePackDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  price!: number;
}

