import { Injectable, NotFoundException } from '@nestjs/common';
import { toBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { UserEntity, UserRole, UserStatus } from '../domain/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(organizationId: string): Promise<UserEntity[]> {
    return this.prisma.user.findMany({
      where: {
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(organizationId: string, id: string): Promise<UserEntity> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: toBigIntId(id, 'user id'),
        organizationId: toBigIntId(organizationId, 'organization id'),
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async create(
    organizationId: string,
    dto: CreateUserDto,
  ): Promise<UserEntity> {
    return this.prisma.user.create({
      data: {
        organizationId: toBigIntId(organizationId, 'organization id'),
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role ?? UserRole.MEMBER,
        status: dto.status ?? UserStatus.INVITED,
      },
    });
  }

  async update(
    organizationId: string,
    id: string,
    dto: UpdateUserDto,
  ): Promise<UserEntity> {
    const userId = toBigIntId(id, 'user id');
    await this.findOne(organizationId, id);

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
        status: dto.status,
      },
    });
  }

  async remove(organizationId: string, id: string): Promise<void> {
    const userId = toBigIntId(id, 'user id');
    await this.findOne(organizationId, id);

    await this.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }
}
