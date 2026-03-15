import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toBigIntId, toOptionalBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { ActivityEntity } from '../domain/entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string): Promise<ActivityEntity[]> {
    return this.prisma.activity.findMany({
      where: {
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(organizationId: string, id: string): Promise<ActivityEntity> {
    const activity = await this.prisma.activity.findFirst({
      where: {
        id: toBigIntId(id, 'activity id'),
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
    });

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  async create(
    organizationId: string,
    dto: CreateActivityDto,
  ): Promise<ActivityEntity> {
    return this.prisma.activity.create({
      data: {
        organizationId: toBigIntId(organizationId, 'organization id'),
        userId: toBigIntId(dto.userId, 'user id'),
        contactId: toOptionalBigIntId(dto.contactId, 'contact id'),
        dealId: toOptionalBigIntId(dto.dealId, 'deal id'),
        type: dto.type,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        completed: dto.completed ?? false,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async update(
    organizationId: string,
    id: string,
    dto: UpdateActivityDto,
  ): Promise<ActivityEntity> {
    const activityId = toBigIntId(id, 'activity id');
    await this.findOne(organizationId, id);

    return this.prisma.activity.update({
      where: {
        id: activityId,
      },
      data: {
        userId: toOptionalBigIntId(dto.userId, 'user id') ?? undefined,
        contactId: toOptionalBigIntId(dto.contactId, 'contact id'),
        dealId: toOptionalBigIntId(dto.dealId, 'deal id'),
        type: dto.type,
        title: dto.title,
        description: dto.description,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        completed: dto.completed,
        metadata: dto.metadata as Prisma.InputJsonValue | undefined,
      },
    });
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const activityId = toBigIntId(id, 'activity id');
    await this.findOne(organizationId, id);

    await this.prisma.activity.delete({
      where: {
        id: activityId,
      },
    });
  }
}
