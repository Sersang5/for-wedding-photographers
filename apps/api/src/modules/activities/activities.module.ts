import { Module } from '@nestjs/common';
import { ActivitiesController } from './api/activities.controller';
import { ActivitiesService } from './application/activities.service';

@Module({
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
