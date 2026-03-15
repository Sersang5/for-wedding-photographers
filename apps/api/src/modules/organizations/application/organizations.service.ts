import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { OrganizationEntity } from '../domain/entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  private readonly organizations: OrganizationEntity[] = [];

  findAll(): OrganizationEntity[] {
    return this.organizations;
  }

  findOne(id: string): OrganizationEntity {
    const organization = this.organizations.find((item) => item.id === id);

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  create(dto: CreateOrganizationDto): OrganizationEntity {
    const now = new Date();
    const organization: OrganizationEntity = {
      id: randomUUID(),
      name: dto.name,
      slug: dto.slug,
      industry: dto.industry ?? 'wedding-photography',
      timezone: dto.timezone ?? 'UTC',
      createdAt: now,
      updatedAt: now,
    };

    this.organizations.push(organization);
    return organization;
  }

  update(id: string, dto: UpdateOrganizationDto): OrganizationEntity {
    const organization = this.findOne(id);

    Object.assign(organization, dto, {
      updatedAt: new Date(),
    });

    return organization;
  }

  remove(id: string): void {
    const index = this.organizations.findIndex((item) => item.id === id);

    if (index < 0) {
      throw new NotFoundException('Organization not found');
    }

    this.organizations.splice(index, 1);
  }
}
