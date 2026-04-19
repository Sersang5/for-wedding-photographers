import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { toBigIntId } from '../../../common/utils/id.util';
import { CreateWeddingStateDto } from './dto/create-wedding-state.dto';
import { UpdateWeddingStateDto } from './dto/update-wedding-state.dto';
import { ReorderWeddingStatesDto } from './dto/reorder-wedding-states.dto';
import { WeddingStateEntity } from '../domain/entities/wedding-state.entity';

@Injectable()
export class WeddingStatesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    organizationId: string,
    includeInactive: boolean,
  ): Promise<WeddingStateEntity[]> {
    const organizationBigIntId = toBigIntId(organizationId, 'organization id');

    return this.prisma.weddingState.findMany({
      where: {
        organizationId: organizationBigIntId,
        isActive: includeInactive ? undefined : true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async create(
    organizationId: string,
    dto: CreateWeddingStateDto,
  ): Promise<WeddingStateEntity> {
    const organizationBigIntId = toBigIntId(organizationId, 'organization id');
    const trimmedName = dto.name.trim();

    if (!trimmedName) {
      throw new BadRequestException('State name cannot be empty');
    }

    const aggregate = await this.prisma.weddingState.aggregate({
      where: {
        organizationId: organizationBigIntId,
      },
      _max: {
        sortOrder: true,
      },
    });

    const sortOrder = (aggregate._max.sortOrder ?? 0) + 1;
    const codeSource = dto.code?.trim() || trimmedName;
    const code = this.normalizeCode(codeSource);

    try {
      return await this.prisma.weddingState.create({
        data: {
          organizationId: organizationBigIntId,
          code,
          name: trimmedName,
          sortOrder,
          isActive: dto.isActive ?? true,
        },
      });
    } catch {
      throw new ConflictException('State code or name already exists');
    }
  }

  async update(
    organizationId: string,
    id: string,
    dto: UpdateWeddingStateDto,
  ): Promise<WeddingStateEntity> {
    const state = await this.findOne(organizationId, id);
    const data: {
      name?: string;
      isActive?: boolean;
    } = {};

    if (dto.name !== undefined) {
      const trimmedName = dto.name.trim();

      if (!trimmedName) {
        throw new BadRequestException('State name cannot be empty');
      }

      data.name = trimmedName;
    }

    if (dto.isActive !== undefined) {
      data.isActive = dto.isActive;
    }

    if (Object.keys(data).length === 0) {
      return state;
    }

    try {
      return await this.prisma.weddingState.update({
        where: {
          id: state.id,
        },
        data,
      });
    } catch {
      throw new ConflictException('State name already exists');
    }
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const state = await this.findOne(organizationId, id);

    const usageCount = await this.prisma.wedding.count({
      where: {
        organizationId: state.organizationId,
        stateId: state.id,
      },
    });

    if (usageCount > 0) {
      throw new ConflictException('State is in use. Deactivate it instead.');
    }

    await this.prisma.weddingState.delete({
      where: {
        id: state.id,
      },
    });
  }

  async reorder(
    organizationId: string,
    dto: ReorderWeddingStatesDto,
  ): Promise<WeddingStateEntity[]> {
    const organizationBigIntId = toBigIntId(organizationId, 'organization id');
    const rawIds = dto.stateIds.map((stateId) => toBigIntId(stateId, 'state id'));
    const uniqueIdSet = new Set(rawIds.map((stateId) => stateId.toString()));

    if (uniqueIdSet.size !== rawIds.length) {
      throw new BadRequestException('State ids cannot contain duplicates');
    }

    const organizationStates = await this.prisma.weddingState.findMany({
      where: {
        organizationId: organizationBigIntId,
      },
      select: {
        id: true,
      },
    });

    if (organizationStates.length !== rawIds.length) {
      throw new BadRequestException('Reorder payload must include all organization states');
    }

    const organizationStateIdSet = new Set(
      organizationStates.map((state) => state.id.toString()),
    );

    for (const stateId of uniqueIdSet) {
      if (!organizationStateIdSet.has(stateId)) {
        throw new BadRequestException('Reorder payload contains invalid state ids');
      }
    }

    await this.prisma.$transaction(
      rawIds.map((stateId, index) =>
        this.prisma.weddingState.update({
          where: {
            id: stateId,
          },
          data: {
            sortOrder: index + 1,
          },
        }),
      ),
    );

    return this.prisma.weddingState.findMany({
      where: {
        organizationId: organizationBigIntId,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });
  }

  async findOne(organizationId: string, id: string): Promise<WeddingStateEntity> {
    const state = await this.prisma.weddingState.findFirst({
      where: {
        id: toBigIntId(id, 'state id'),
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
    });

    if (!state) {
      throw new NotFoundException('Wedding state not found');
    }

    return state;
  }

  private normalizeCode(input: string): string {
    const normalized = input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    if (!normalized) {
      throw new BadRequestException('State code cannot be empty');
    }

    if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/.test(normalized)) {
      throw new BadRequestException('State code must be snake_case');
    }

    return normalized;
  }
}
