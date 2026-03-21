import { Injectable, NotFoundException } from '@nestjs/common';
import { toBigIntId, toOptionalBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { WeddingEntity } from '../domain/entities/wedding.entity';
import { CreateWeddingDto } from './dto/create-wedding.dto';
import { UpdateWeddingDto } from './dto/update-wedding.dto';

@Injectable()
export class WeddingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<WeddingEntity[]> {
    return this.prisma.wedding.findMany({
      include: {
        pack: true,
      },
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<WeddingEntity> {
    const wedding = await this.prisma.wedding.findUnique({
      where: {
        id: toBigIntId(id, 'wedding id'),
      },
      include: {
        pack: true,
      },
    });

    if (!wedding) {
      throw new NotFoundException('Wedding not found');
    }

    return wedding;
  }

  async create(dto: CreateWeddingDto): Promise<WeddingEntity> {
    return this.prisma.wedding.create({
      data: {
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
        state: '0',
        packId: toOptionalBigIntId(dto.packId, 'pack id'),
      },
      include: {
        pack: true,
      },
    });
  }

  async update(id: string, dto: UpdateWeddingDto): Promise<WeddingEntity> {
    const weddingId = toBigIntId(id, 'wedding id');
    await this.findOne(id);

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
        state: dto.state,
        packId: toOptionalBigIntId(dto.packId, 'pack id'),
      },
      include: {
        pack: true,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const weddingId = toBigIntId(id, 'wedding id');
    await this.findOne(id);

    await this.prisma.wedding.delete({
      where: {
        id: weddingId,
      },
    });
  }
}
