import { Module } from '@nestjs/common';
import { WeddingsController } from './api/weddings.controller';
import { WeddingsService } from './application/weddings.service';

@Module({
  controllers: [WeddingsController],
  providers: [WeddingsService],
  exports: [WeddingsService],
})
export class WeddingsModule {}
