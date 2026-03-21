import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { WeddingsService } from '../application/weddings.service';
import { CreateWeddingDto } from '../application/dto/create-wedding.dto';
import { UpdateWeddingDto } from '../application/dto/update-wedding.dto';

@Controller('weddings')
export class WeddingsController {
  constructor(private readonly weddingsService: WeddingsService) {}

  @Get()
  findAll() {
    return this.weddingsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weddingsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateWeddingDto) {
    return this.weddingsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWeddingDto) {
    return this.weddingsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weddingsService.remove(id);
  }
}
