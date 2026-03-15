import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { LeadStatus } from '../../domain/entities/contact.entity';

export class CreateContactDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  source?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsDateString()
  @IsOptional()
  weddingDate?: string;

  @IsEnum(LeadStatus)
  @IsOptional()
  leadStatus?: LeadStatus;

  @IsString()
  @IsOptional()
  ownerUserId?: string;
}
