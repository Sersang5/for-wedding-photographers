import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { ActivityEntity } from '../domain/entities/activity.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
  private readonly activities: ActivityEntity[] = [];

  findAll(organizationId: string): ActivityEntity[] {
    return this.activities.filter(
      (activity) => activity.organizationId === organizationId,
    );
  }

  findOne(organizationId: string, id: string): ActivityEntity {
    const activity = this.activities.find(
      (item) => item.organizationId === organizationId && item.id === id,
    );

    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    return activity;
  }

  create(organizationId: string, dto: CreateActivityDto): ActivityEntity {
    const now = new Date();
    const activity: ActivityEntity = {
      id: randomUUID(),
      organizationId,
      userId: dto.userId,
      contactId: dto.contactId,
      dealId: dto.dealId,
      type: dto.type,
      title: dto.title,
      description: dto.description,
      dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
      completed: dto.completed ?? false,
      metadata: dto.metadata,
      createdAt: now,
      updatedAt: now,
    };

    this.activities.push(activity);
    return activity;
  }

  update(
    organizationId: string,
    id: string,
    dto: UpdateActivityDto,
  ): ActivityEntity {
    const activity = this.findOne(organizationId, id);

    Object.assign(activity, dto, {
      dueDate: dto.dueDate ? new Date(dto.dueDate) : activity.dueDate,
      updatedAt: new Date(),
    });

    return activity;
  }

  remove(organizationId: string, id: string): void {
    const index = this.activities.findIndex(
      (item) => item.organizationId === organizationId && item.id === id,
    );

    if (index < 0) {
      throw new NotFoundException('Activity not found');
    }

    this.activities.splice(index, 1);
  }
}
