import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DealStage, DealStatus } from '../../domain/entities/deal.entity';

export class CreateDealDto {
  @IsString()
  contactId: string;

  @IsString()
  title: string;

  @IsEnum(DealStage)
  @IsOptional()
  stage?: DealStage;

  @IsEnum(DealStatus)
  @IsOptional()
  status?: DealStatus;

  @IsNumber()
  value: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsDateString()
  @IsOptional()
  expectedCloseDate?: string;
}
