import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TenantId } from '../../../common/decorators/tenant-id.decorator';
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { CreateWeddingStateDto } from '../application/dto/create-wedding-state.dto';
import { ReorderWeddingStatesDto } from '../application/dto/reorder-wedding-states.dto';
import { UpdateWeddingStateDto } from '../application/dto/update-wedding-state.dto';
import { WeddingStatesService } from '../application/wedding-states.service';

@UseGuards(TenantGuard)
@Controller('wedding-states')
export class WeddingStatesController {
  constructor(private readonly weddingStatesService: WeddingStatesService) {}

  @Get()
  findAll(
    @TenantId() organizationId: string,
    @Query('includeInactive') includeInactive?: string,
  ) {
    return this.weddingStatesService.findAll(
      organizationId,
      includeInactive === 'true',
    );
  }

  @Post()
  create(
    @TenantId() organizationId: string,
    @Body() dto: CreateWeddingStateDto,
  ) {
    return this.weddingStatesService.create(organizationId, dto);
  }

  @Patch('reorder')
  reorder(
    @TenantId() organizationId: string,
    @Body() dto: ReorderWeddingStatesDto,
  ) {
    return this.weddingStatesService.reorder(organizationId, dto);
  }

  @Patch(':id')
  update(
    @TenantId() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateWeddingStateDto,
  ) {
    return this.weddingStatesService.update(organizationId, id, dto);
  }

  @Delete(':id')
  async remove(@TenantId() organizationId: string, @Param('id') id: string) {
    await this.weddingStatesService.remove(organizationId, id);

    return {
      success: true,
    };
  }
}
