import { Module } from '@nestjs/common';
import { OrganizationsController } from './api/organizations.controller';
import { OrganizationsService } from './application/organizations.service';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
