import { Module } from '@nestjs/common';
import { WeddingStatesModule } from '../wedding-states/wedding-states.module';
import { WeddingsController } from './api/weddings.controller';
import { WeddingsService } from './application/weddings.service';

@Module({
  imports: [WeddingStatesModule],
  controllers: [WeddingsController],
  providers: [WeddingsService],
  exports: [WeddingsService],
})
export class WeddingsModule {}
