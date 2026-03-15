import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { DealStage, DealStatus } from '../../domain/entities/deal.entity';

export class CreateDealDto {
  @IsNumberString()
  contactId!: string;

  @IsString()
  title!: string;

  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage;

  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;

  @IsNumber()
  value!: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  expectedCloseDate?: string;
}
