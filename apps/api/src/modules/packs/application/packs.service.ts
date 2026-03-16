import { Injectable, NotFoundException } from '@nestjs/common';
import { toBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { PackEntity } from '../domain/entities/pack.entity';
import { CreatePackDto } from './dto/create-pack.dto';
import { UpdatePackDto } from './dto/update-pack.dto';

@Injectable()
export class PacksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<PackEntity[]> {
    return this.prisma.pack.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<PackEntity> {
    const pack = await this.prisma.pack.findUnique({
      where: {
        id: toBigIntId(id, 'pack id'),
      },
    });

    if (!pack) {
      throw new NotFoundException('Pack not found');
    }

    return pack;
  }

  async create(dto: CreatePackDto): Promise<PackEntity> {
    return this.prisma.pack.create({
      data: {
        name: dto.name,
        description: dto.description ?? '',
        price: dto.price,
      },
    });
  }

  async update(id: string, dto: UpdatePackDto): Promise<PackEntity> {
    const packId = toBigIntId(id, 'pack id');
    await this.findOne(id);

    return this.prisma.pack.update({
      where: {
        id: packId,
      },
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const packId = toBigIntId(id, 'pack id');
    await this.findOne(id);

    await this.prisma.pack.delete({
      where: {
        id: packId,
      },
    });
  }
}

