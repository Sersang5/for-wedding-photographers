import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CouplesService } from '../application/couples.service';
import { CreateCoupleDto } from '../application/dto/create-couple.dto';
import { UpdateCoupleDto } from '../application/dto/update-couple.dto';

@Controller('couples')
export class CouplesController {
  constructor(private readonly couplesService: CouplesService) {}

  @Get()
  findAll() {
    return this.couplesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.couplesService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateCoupleDto) {
    return this.couplesService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCoupleDto) {
    return this.couplesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.couplesService.remove(id);
  }
}