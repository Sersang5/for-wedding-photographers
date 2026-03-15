import { Module } from '@nestjs/common';
import { DealsController } from './api/deals.controller';
import { DealsService } from './application/deals.service';

@Module({
  controllers: [DealsController],
  providers: [DealsService],
  exports: [DealsService],
})
export class DealsModule {}
