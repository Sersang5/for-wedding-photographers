import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ContactEntity, LeadStatus } from '../domain/entities/contact.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
  private readonly contacts: ContactEntity[] = [];

  findAll(organizationId: string): ContactEntity[] {
    return this.contacts.filter(
      (contact) => contact.organizationId === organizationId,
    );
  }

  findOne(organizationId: string, id: string): ContactEntity {
    const contact = this.contacts.find(
      (item) => item.organizationId === organizationId && item.id === id,
    );

    if (!contact) {
      throw new NotFoundException('Contact not found');
    }

    return contact;
  }

  create(organizationId: string, dto: CreateContactDto): ContactEntity {
    const now = new Date();
    const contact: ContactEntity = {
      id: randomUUID(),
      organizationId,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      source: dto.source,
      tags: dto.tags ?? [],
      weddingDate: dto.weddingDate ? new Date(dto.weddingDate) : undefined,
      leadStatus: dto.leadStatus ?? LeadStatus.NEW,
      ownerUserId: dto.ownerUserId,
      createdAt: now,
      updatedAt: now,
    };

    this.contacts.push(contact);
    return contact;
  }

  update(
    organizationId: string,
    id: string,
    dto: UpdateContactDto,
  ): ContactEntity {
    const contact = this.findOne(organizationId, id);

    Object.assign(contact, dto, {
      weddingDate: dto.weddingDate
        ? new Date(dto.weddingDate)
        : contact.weddingDate,
      updatedAt: new Date(),
    });

    return contact;
  }

  remove(organizationId: string, id: string): void {
    const index = this.contacts.findIndex(
      (item) => item.organizationId === organizationId && item.id === id,
    );

    if (index < 0) {
      throw new NotFoundException('Contact not found');
    }

    this.contacts.splice(index, 1);
  }
}
