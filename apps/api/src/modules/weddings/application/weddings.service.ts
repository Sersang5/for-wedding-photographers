import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { toBigIntId, toOptionalBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { WeddingEntity } from '../domain/entities/wedding.entity';
import { CreateWeddingDto } from './dto/create-wedding.dto';
import { UpdateWeddingDto } from './dto/update-wedding.dto';
import { UpdateWeddingStateDto } from './dto/update-wedding-state.dto';

const DEFAULT_WEDDING_STATE_CODE = 'nueva_boda';

@Injectable()
export class WeddingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string): Promise<WeddingEntity[]> {
    return this.prisma.wedding.findMany({
      where: {
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
      include: {
        pack: true,
        state: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(organizationId: string, id: string): Promise<WeddingEntity> {
    const wedding = await this.prisma.wedding.findFirst({
      where: {
        id: toBigIntId(id, 'wedding id'),
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
      include: {
        pack: true,
        state: true,
      },
    });

    if (!wedding) {
      throw new NotFoundException('Wedding not found');
    }

    return wedding;
  }

  async create(
    organizationId: string,
    dto: CreateWeddingDto,
  ): Promise<WeddingEntity> {
    const organizationBigIntId = toBigIntId(organizationId, 'organization id');
    const stateId = dto.stateId
      ? await this.validateStateForOrganization(organizationId, dto.stateId)
      : await this.getDefaultStateId(organizationBigIntId);

    return this.prisma.wedding.create({
      data: {
        organizationId: organizationBigIntId,
        name1: dto.name1,
        lastName1: dto.lastName1 ?? '',
        name2: dto.name2,
        lastName2: dto.lastName2 ?? '',
        email1: dto.email1 ?? '',
        email2: dto.email2,
        phone1: dto.phone1,
        phone2: dto.phone2,
        language: dto.language,
        weddingDate: new Date(dto.weddingDate),
        location: dto.location,
        stateId,
        packId: toOptionalBigIntId(dto.packId, 'pack id'),
      },
      include: {
        pack: true,
        state: true,
      },
    });
  }

  async update(
    organizationId: string,
    id: string,
    dto: UpdateWeddingDto,
  ): Promise<WeddingEntity> {
    const weddingId = toBigIntId(id, 'wedding id');
    await this.findOne(organizationId, id);

    const stateId = dto.stateId
      ? await this.validateStateForOrganization(organizationId, dto.stateId)
      : undefined;

    return this.prisma.wedding.update({
      where: {
        id: weddingId,
      },
      data: {
        name1: dto.name1,
        lastName1: dto.lastName1,
        name2: dto.name2,
        lastName2: dto.lastName2,
        email1: dto.email1,
        email2: dto.email2,
        phone1: dto.phone1,
        phone2: dto.phone2,
        language: dto.language,
        weddingDate: dto.weddingDate ? new Date(dto.weddingDate) : undefined,
        location: dto.location,
        stateId,
        packId: toOptionalBigIntId(dto.packId, 'pack id'),
      },
      include: {
        pack: true,
        state: true,
      },
    });
  }

  async updateState(
    organizationId: string,
    id: string,
    dto: UpdateWeddingStateDto,
  ): Promise<WeddingEntity> {
    const weddingId = toBigIntId(id, 'wedding id');
    await this.findOne(organizationId, id);

    const stateId = await this.validateStateForOrganization(
      organizationId,
      dto.stateId,
    );

    return this.prisma.wedding.update({
      where: {
        id: weddingId,
      },
      data: {
        stateId,
      },
      include: {
        pack: true,
        state: true,
      },
    });
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const weddingId = toBigIntId(id, 'wedding id');
    await this.findOne(organizationId, id);

    await this.prisma.wedding.delete({
      where: {
        id: weddingId,
      },
    });
  }

  private async getDefaultStateId(organizationId: bigint): Promise<bigint> {
    const defaultState = await this.prisma.weddingState.findFirst({
      where: {
        organizationId,
        code: DEFAULT_WEDDING_STATE_CODE,
      },
      select: {
        id: true,
      },
    });

    if (!defaultState) {
      throw new NotFoundException('Default wedding state not found');
    }

    return defaultState.id;
  }

  private async validateStateForOrganization(
    organizationId: string,
    stateId: string,
  ): Promise<bigint> {
    const stateBigIntId = toBigIntId(stateId, 'state id');

    const state = await this.prisma.weddingState.findFirst({
      where: {
        id: stateBigIntId,
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
      select: {
        id: true,
      },
    });

    if (!state) {
      throw new BadRequestException('Invalid state for organization');
    }

    return state.id;
  }
}
