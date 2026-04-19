import { Module } from '@nestjs/common';
import { WeddingStatesController } from './api/wedding-states.controller';
import { WeddingStatesService } from './application/wedding-states.service';

@Module({
  controllers: [WeddingStatesController],
  providers: [WeddingStatesService],
  exports: [WeddingStatesService],
})
export class WeddingStatesModule {}
