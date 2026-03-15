import { Injectable, NotFoundException } from '@nestjs/common';
import { toBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { OrganizationEntity } from '../domain/entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<OrganizationEntity[]> {
    return this.prisma.organization.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<OrganizationEntity> {
    const organization = await this.prisma.organization.findUnique({
      where: {
        id: toBigIntId(id, 'organization id'),
      },
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return organization;
  }

  async create(dto: CreateOrganizationDto): Promise<OrganizationEntity> {
    return this.prisma.organization.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        industry: dto.industry ?? 'wedding-photography',
        timezone: dto.timezone ?? 'UTC',
      },
    });
  }

  async update(
    id: string,
    dto: UpdateOrganizationDto,
  ): Promise<OrganizationEntity> {
    const organizationId = toBigIntId(id, 'organization id');
    await this.findOne(id);

    return this.prisma.organization.update({
      where: {
        id: organizationId,
      },
      data: dto,
    });
  }

  async remove(id: string): Promise<void> {
    const organizationId = toBigIntId(id, 'organization id');
    await this.findOne(id);

    await this.prisma.organization.delete({
      where: {
        id: organizationId,
      },
    });
  }
}
