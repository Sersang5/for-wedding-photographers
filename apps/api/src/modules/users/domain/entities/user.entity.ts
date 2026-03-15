export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
}

export enum UserStatus {
  ACTIVE = 'active',
  INVITED = 'invited',
  DISABLED = 'disabled',
}

export class UserEntity {
  id!: bigint;
  organizationId!: bigint;
  email!: string;
  firstName!: string;
  lastName!: string;
  role!: UserRole | string;
  status!: UserStatus | string;
  createdAt!: Date;
  updatedAt!: Date;
}
