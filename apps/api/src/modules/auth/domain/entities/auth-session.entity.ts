export class AuthSessionEntity {
  id: string;
  userId: string;
  organizationId: string;
  refreshToken: string;
  expiresAt: Date;
  createdAt: Date;
}
