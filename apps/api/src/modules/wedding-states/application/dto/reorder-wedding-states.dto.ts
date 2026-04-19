import { ArrayNotEmpty, IsArray, IsNumberString } from 'class-validator';

export class ReorderWeddingStatesDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumberString({}, { each: true })
  stateIds!: string[];
}
