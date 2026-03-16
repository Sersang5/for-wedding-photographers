import { Module } from '@nestjs/common';
import { PacksController } from './api/packs.controller';
import { PacksService } from './application/packs.service';

@Module({
  controllers: [PacksController],
  providers: [PacksService],
  exports: [PacksService],
})
export class PacksModule {}

