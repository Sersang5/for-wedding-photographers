import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { DealEntity, DealStage, DealStatus } from '../domain/entities/deal.entity';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';

@Injectable()
export class DealsService {
  private readonly deals: DealEntity[] = [];

  findAll(organizationId: string): DealEntity[] {
    return this.deals.filter((deal) => deal.organizationId === organizationId);
  }

  findOne(organizationId: string, id: string): DealEntity {
    const deal = this.deals.find(
      (item) => item.organizationId === organizationId && item.id === id,
    );

    if (!deal) {
      throw new NotFoundException('Deal not found');
    }

    return deal;
  }

  create(organizationId: string, dto: CreateDealDto): DealEntity {
    const now = new Date();
    const deal: DealEntity = {
      id: randomUUID(),
      organizationId,
      contactId: dto.contactId,
      title: dto.title,
      stage: dto.stage ?? DealStage.LEAD,
      status: dto.status ?? DealStatus.OPEN,
      value: dto.value,
      currency: dto.currency ?? 'USD',
      expectedCloseDate: dto.expectedCloseDate
        ? new Date(dto.expectedCloseDate)
        : undefined,
      createdAt: now,
      updatedAt: now,
    };

    this.deals.push(deal);
    return deal;
  }

  update(organizationId: string, id: string, dto: UpdateDealDto): DealEntity {
    const deal = this.findOne(organizationId, id);

    Object.assign(deal, dto, {
      expectedCloseDate: dto.expectedCloseDate
        ? new Date(dto.expectedCloseDate)
        : deal.expectedCloseDate,
      updatedAt: new Date(),
    });

    return deal;
  }

  remove(organizationId: string, id: string): void {
    const index = this.deals.findIndex(
      (item) => item.organizationId === organizationId && item.id === id,
    );

    if (index < 0) {
      throw new NotFoundException('Deal not found');
    }

    this.deals.splice(index, 1);
  }
}
