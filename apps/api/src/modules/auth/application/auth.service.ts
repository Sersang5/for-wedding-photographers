import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { AuthSessionEntity } from '../domain/entities/auth-session.entity';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthUser } from './interfaces/google-auth-user.interface';

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    organizationId: string;
  };
};

@Injectable()
export class AuthService {
  private readonly sessions: AuthSessionEntity[] = [];

  register(dto: RegisterDto): AuthResponse {
    const userId = randomUUID();
    const organizationId = this.stableId(dto.organizationName);

    return this.issueSession({
      userId,
      organizationId,
      email: dto.email,
    });
  }

  login(dto: LoginDto): AuthResponse {
    if (!dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueSession({
      userId: this.stableId(dto.email),
      organizationId: dto.organizationId,
      email: dto.email,
    });
  }

  loginWithGoogle(googleUser: GoogleAuthUser): AuthResponse {
    const organizationId =
      googleUser.organizationId ?? this.defaultOrganizationId(googleUser.email);

    return this.issueSession({
      userId: this.stableId(`google:${googleUser.googleId}`),
      organizationId,
      email: googleUser.email,
    });
  }

  refresh(dto: RefreshTokenDto): AuthResponse {
    const session = this.sessions.find(
      (item) => item.refreshToken === dto.refreshToken,
    );

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.expiresAt <= new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    this.sessions.splice(this.sessions.indexOf(session), 1);

    return this.issueSession({
      userId: session.userId,
      organizationId: session.organizationId,
      email: `user-${session.userId}@placeholder.local`,
    });
  }

  private issueSession(input: {
    userId: string;
    organizationId: string;
    email: string;
  }): AuthResponse {
    const accessToken = randomUUID();
    const refreshToken = randomUUID();
    const expiresIn = 60 * 60;

    const session: AuthSessionEntity = {
      id: randomUUID(),
      userId: input.userId,
      organizationId: input.organizationId,
      refreshToken,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    this.sessions.push(session);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        id: input.userId,
        email: input.email,
        organizationId: input.organizationId,
      },
    };
  }

  private defaultOrganizationId(email: string): string {
    const domain = email.split('@')[1] ?? 'default-org';
    return this.stableId(`org:${domain}`);
  }

  private stableId(seed: string): string {
    return createHash('sha256').update(seed).digest('hex').slice(0, 24);
  }
}