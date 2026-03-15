import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CreateActivityDto } from '../application/dto/create-activity.dto';
import { UpdateActivityDto } from '../application/dto/update-activity.dto';
import { ActivitiesService } from '../application/activities.service';

@UseGuards(TenantGuard)
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Get()
  findAll(@TenantId() organizationId: string) {
    return this.activitiesService.findAll(organizationId);
  }

  @Get(':id')
  findOne(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.activitiesService.findOne(organizationId, id);
  }

  @Post()
  create(
    @TenantId() organizationId: string,
    @Body() dto: CreateActivityDto,
  ) {
    return this.activitiesService.create(organizationId, dto);
  }

  @Patch(':id')
  update(
    @TenantId() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(organizationId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() organizationId: string, @Param('id') id: string) {
    this.activitiesService.remove(organizationId, id);
    return {
      success: true,
    };
  }
}
