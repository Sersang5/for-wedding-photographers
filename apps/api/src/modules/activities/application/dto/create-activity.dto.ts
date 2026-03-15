import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { ActivityType } from '../../domain/entities/activity.entity';

export class CreateActivityDto {
  @IsNumberString()
  userId!: string;

  @IsNumberString()
  @IsOptional()
  contactId?: string;

  @IsNumberString()
  @IsOptional()
  dealId?: string;

  @IsEnum(ActivityType)
  type!: ActivityType;

  @IsString()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}
