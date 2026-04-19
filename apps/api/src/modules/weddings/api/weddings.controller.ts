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
import { WeddingsService } from '../application/weddings.service';
import { CreateWeddingDto } from '../application/dto/create-wedding.dto';
import { UpdateWeddingDto } from '../application/dto/update-wedding.dto';
import { UpdateWeddingStateDto } from '../application/dto/update-wedding-state.dto';

@UseGuards(TenantGuard)
@Controller('weddings')
export class WeddingsController {
  constructor(private readonly weddingsService: WeddingsService) {}

  @Get()
  findAll(@TenantId() organizationId: string) {
    return this.weddingsService.findAll(organizationId);
  }

  @Get(':id')
  findOne(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.weddingsService.findOne(organizationId, id);
  }

  @Post()
  create(
    @TenantId() organizationId: string,
    @Body() dto: CreateWeddingDto,
  ) {
    return this.weddingsService.create(organizationId, dto);
  }

  @Patch(':id/state')
  updateState(
    @TenantId() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWeddingStateDto,
  ) {
    return this.weddingsService.updateState(organizationId, id, dto);
  }

  @Patch(':id')
  update(
    @TenantId() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWeddingDto,
  ) {
    return this.weddingsService.update(organizationId, id, dto);
  }

  @Delete(':id')
  async remove(@TenantId() organizationId: string, @Param('id') id: string) {
    await this.weddingsService.remove(organizationId, id);

    return {
      success: true,
    };
  }
}
