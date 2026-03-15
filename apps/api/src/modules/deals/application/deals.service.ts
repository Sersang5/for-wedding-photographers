import { Injectable, NotFoundException } from '@nestjs/common';
import { toBigIntId, toOptionalBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { DealEntity, DealStage, DealStatus } from '../domain/entities/deal.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string): Promise<DealEntity[]> {
    return this.prisma.deal.findMany({
      where: {
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(organizationId: string, id: string): Promise<DealEntity> {
    const deal = await this.prisma.deal.findFirst({
      where: {
        id: toBigIntId(id, 'deal id'),
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
    });

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return deal;
  }

  async create(organizationId: string, dto: CreateDealDto): Promise<DealEntity> {
    return this.prisma.deal.create({
      data: {
        organizationId: toBigIntId(organizationId, 'organization id'),
        contactId: toBigIntId(dto.contactId, 'contact id'),
        title: dto.title,
        stage: dto.stage ?? DealStage.LEAD,
        status: dto.status ?? DealStatus.OPEN,
        value: dto.value,
        currency: dto.currency ?? 'USD',
        expectedCloseDate: dto.expectedCloseDate
          ? new Date(dto.expectedCloseDate)
          : undefined,
      },
    });
  }

  async update(
    organizationId: string,
    id: string,
    dto: UpdateDealDto,
  ): Promise<DealEntity> {
    const dealId = toBigIntId(id, 'deal id');
    await this.findOne(organizationId, id);

    return this.prisma.deal.update({
      where: {
        id: dealId,
      },
      data: {
        contactId: toOptionalBigIntId(dto.contactId, 'contact id') ?? undefined,
        title: dto.title,
        stage: dto.stage,
        status: dto.status,
        value: dto.value,
        currency: dto.currency,
        expectedCloseDate: dto.expectedCloseDate
          ? new Date(dto.expectedCloseDate)
          : undefined,
      },
    });
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const dealId = toBigIntId(id, 'deal id');
    await this.findOne(organizationId, id);

    await this.prisma.deal.delete({
      where: {
        id: dealId,
      },
    });
  }
}
