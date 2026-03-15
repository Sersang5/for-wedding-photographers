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
import { CreateDealDto } from '../application/dto/create-deal.dto';
import { UpdateDealDto } from '../application/dto/update-deal.dto';
import { DealsService } from '../application/deals.service';

@UseGuards(TenantGuard)
@Controller('deals')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get()
  findAll(@TenantId() organizationId: string) {
    return this.dealsService.findAll(organizationId);
  }

  @Get(':id')
  findOne(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.dealsService.findOne(organizationId, id);
  }

  @Post()
  create(@TenantId() organizationId: string, @Body() dto: CreateDealDto) {
    return this.dealsService.create(organizationId, dto);
  }

  @Patch(':id')
  update(
    @TenantId() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateDealDto,
  ) {
    return this.dealsService.update(organizationId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() organizationId: string, @Param('id') id: string) {
    this.dealsService.remove(organizationId, id);
    return {
      success: true,
    };
  }
}
