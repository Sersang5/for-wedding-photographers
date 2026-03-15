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
import { CreateContactDto } from '../application/dto/create-contact.dto';
import { UpdateContactDto } from '../application/dto/update-contact.dto';
import { ContactsService } from '../application/contacts.service';

@UseGuards(TenantGuard)
@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  findAll(@TenantId() organizationId: string) {
    return this.contactsService.findAll(organizationId);
  }

  @Get(':id')
  findOne(@TenantId() organizationId: string, @Param('id') id: string) {
    return this.contactsService.findOne(organizationId, id);
  }

  @Post()
  create(
    @TenantId() organizationId: string,
    @Body() dto: CreateContactDto,
  ) {
    return this.contactsService.create(organizationId, dto);
  }

  @Patch(':id')
  update(
    @TenantId() organizationId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContactDto,
  ) {
    return this.contactsService.update(organizationId, id, dto);
  }

  @Delete(':id')
  remove(@TenantId() organizationId: string, @Param('id') id: string) {
    this.contactsService.remove(organizationId, id);
    return {
      success: true,
    };
  }
}
