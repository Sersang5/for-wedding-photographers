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
import { CreateUserDto } from '../application/dto/create-user.dto';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { UsersService } from '../application/users.service';

@UseGuards(TenantGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@TenantId() organizationId: string) {
    return this.usersService.findAll(organizationId);
  }

  @Get(':id')
  findOne(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.usersService.findOne(organizationId, id);
  }

  @Post()
  create(
    @TenantId() organizationId: string,
    @Body() dto: CreateUserDto,
  ) {
    return this.usersService.create(organizationId, dto);
  }

  @Patch(':id')
  update(
    @TenantId() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.usersService.update(organizationId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() organizationId: string, @Param('id') id: string) {
    this.usersService.remove(organizationId, id);
    return {
      success: true,
    };
  }
}
