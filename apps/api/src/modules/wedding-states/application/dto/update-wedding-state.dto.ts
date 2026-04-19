import { PartialType } from '@nestjs/mapped-types';
import { CreateWeddingStateDto } from './create-wedding-state.dto';

export class UpdateWeddingStateDto extends PartialType(CreateWeddingStateDto) {}
