import { Injectable, NotFoundException } from '@nestjs/common';
import { toBigIntId, toOptionalBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { ContactEntity, LeadStatus } from '../domain/entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string): Promise<ContactEntity[]> {
    return this.prisma.contact.findMany({
      where: {
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(organizationId: string, id: string): Promise<ContactEntity> {
    const contact = await this.prisma.contact.findFirst({
      where: {
        id: toBigIntId(id, 'contact id'),
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
    });

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  async create(
    organizationId: string,
    dto: CreateContactDto,
  ): Promise<ContactEntity> {
    return this.prisma.contact.create({
      data: {
        organizationId: toBigIntId(organizationId, 'organization id'),
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        source: dto.source,
        tags: dto.tags ?? [],
        weddingDate: dto.weddingDate ? new Date(dto.weddingDate) : undefined,
        leadStatus: dto.leadStatus ?? LeadStatus.NEW,
        ownerUserId: toOptionalBigIntId(dto.ownerUserId, 'owner user id'),
      },
    });
  }

  async update(
    organizationId: string,
    id: string,
    dto: UpdateContactDto,
  ): Promise<ContactEntity> {
    const contactId = toBigIntId(id, 'contact id');
    await this.findOne(organizationId, id);

    return this.prisma.contact.update({
      where: {
        id: contactId,
      },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        phone: dto.phone,
        source: dto.source,
        tags: dto.tags,
        weddingDate: dto.weddingDate ? new Date(dto.weddingDate) : undefined,
        leadStatus: dto.leadStatus,
        ownerUserId: toOptionalBigIntId(dto.ownerUserId, 'owner user id'),
      },
    });
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const contactId = toBigIntId(id, 'contact id');
    await this.findOne(organizationId, id);

    await this.prisma.contact.delete({
      where: {
        id: contactId,
      },
    });
  }
}
