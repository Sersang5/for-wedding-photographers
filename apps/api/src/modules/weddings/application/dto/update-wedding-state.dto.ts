import { IsNumberString } from 'class-validator';

export class UpdateWeddingStateDto {
  @IsNumberString()
  stateId!: string;
}
