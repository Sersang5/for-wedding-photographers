import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWeddingStateDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
