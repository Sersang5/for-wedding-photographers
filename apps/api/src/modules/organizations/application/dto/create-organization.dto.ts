import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Matches(/^[a-z0-9-]+$/)
  slug: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  timezone?: string;
}
