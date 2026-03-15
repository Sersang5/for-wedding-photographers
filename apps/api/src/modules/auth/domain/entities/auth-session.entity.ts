export class AuthSessionEntity {
  id!: bigint;
  userId!: bigint;
  organizationId!: bigint;
  refreshToken!: string;
  expiresAt!: Date;
  createdAt!: Date;
}
