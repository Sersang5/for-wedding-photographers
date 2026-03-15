import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UserEntity, UserRole, UserStatus } from '../domain/entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly users: UserEntity[] = [];

  findAll(organizationId: string): UserEntity[] {
    return this.users.filter((user) => user.organizationId === organizationId);
  }

  findOne(organizationId: string, id: string): UserEntity {
    const user = this.users.find(
      (item) => item.organizationId === organizationId && item.id === id,
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  create(organizationId: string, dto: CreateUserDto): UserEntity {
    const now = new Date();
    const user: UserEntity = {
      id: randomUUID(),
      organizationId,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: dto.role ?? UserRole.MEMBER,
      status: dto.status ?? UserStatus.INVITED,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(user);
    return user;
  }

  update(
    organizationId: string,
    id: string,
    dto: UpdateUserDto,
  ): UserEntity {
    const user = this.findOne(organizationId, id);

    Object.assign(user, dto, {
      updatedAt: new Date(),
    });

    return user;
  }

  remove(organizationId: string, id: string): void {
    const index = this.users.findIndex(
      (item) => item.organizationId === organizationId && item.id === id,
    );

    if (index < 0) {
      throw new NotFoundException('User not found');
    }

    this.users.splice(index, 1);
  }
}
