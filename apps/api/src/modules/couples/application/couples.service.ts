import { Injectable, NotFoundException } from '@nestjs/common';
import { toBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { CoupleEntity } from '../domain/entities/couple.entity';
import { CreateCoupleDto } from './dto/create-couple.dto';
import { UpdateCoupleDto } from './dto/update-couple.dto';

@Injectable()
export class CouplesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CoupleEntity[]> {
    return this.prisma.couple.findMany({
      orderBy: {
        id: 'desc',
      },
    });
  }

  async findOne(id: string): Promise<CoupleEntity> {
    const couple = await this.prisma.couple.findUnique({
      where: {
        id: toBigIntId(id, 'couple id'),
      },
    });

    if (!couple) {
      throw new NotFoundException('Couple not found');
    }

    return couple;
  }

  async create(dto: CreateCoupleDto): Promise<CoupleEntity> {
    return this.prisma.couple.create({
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
        pack: dto.pack,
      },
    });
  }

  async update(id: string, dto: UpdateCoupleDto): Promise<CoupleEntity> {
    const coupleId = toBigIntId(id, 'couple id');
    await this.findOne(id);

    return this.prisma.couple.update({
      where: {
        id: coupleId,
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
        pack: dto.pack,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const coupleId = toBigIntId(id, 'couple id');
    await this.findOne(id);

    await this.prisma.couple.delete({
      where: {
        id: coupleId,
      },
    });
  }
}
