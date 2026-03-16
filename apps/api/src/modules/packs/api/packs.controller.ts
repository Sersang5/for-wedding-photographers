import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePackDto } from '../application/dto/create-pack.dto';
import { UpdatePackDto } from '../application/dto/update-pack.dto';
import { PacksService } from '../application/packs.service';

@Controller('packs')
export class PacksController {
  constructor(private readonly packsService: PacksService) {}

  @Get()
  findAll() {
    return this.packsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.packsService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreatePackDto) {
    return this.packsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePackDto) {
    return this.packsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.packsService.remove(id);
  }
}

