import { Module } from '@nestjs/common';
import { CouplesController } from './api/couples.controller';
import { CouplesService } from './application/couples.service';

@Module({
  controllers: [CouplesController],
  providers: [CouplesService],
  exports: [CouplesService],
})
export class CouplesModule {}