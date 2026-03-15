import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHash, randomUUID } from 'node:crypto';
import { toBigIntId } from '../../../common/utils/id.util';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleAuthUser } from './interfaces/google-auth-user.interface';

export type AuthResponse = {
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
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const organization = await this.createOrganizationForRegistration(
      dto.organizationName,
    );

    const user = await this.prisma.user.create({
      data: {
        organizationId: organization.id,
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        passwordHash: this.hashPassword(dto.password),
        role: 'owner',
        status: 'active',
      },
    });

    return this.issueSession({
      userId: user.id,
      organizationId: organization.id,
      email: user.email,
    });
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    if (!dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.prisma.user.findFirst({
      where: {
        organizationId: toBigIntId(dto.organizationId, 'organization id'),
        email: dto.email,
      },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.passwordHash !== this.hashPassword(dto.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.issueSession({
      userId: user.id,
      organizationId: user.organizationId,
      email: user.email,
    });
  }

  async loginWithGoogle(googleUser: GoogleAuthUser): Promise<AuthResponse> {
    const organization = await this.ensureOrganizationForGoogle(googleUser);

    const user = await this.prisma.user.upsert({
      where: {
        organizationId_email: {
          organizationId: organization.id,
          email: googleUser.email,
        },
      },
      update: {
        firstName: googleUser.firstName ?? 'Google',
        lastName: googleUser.lastName ?? 'User',
        status: 'active',
      },
      create: {
        organizationId: organization.id,
        email: googleUser.email,
        firstName: googleUser.firstName ?? 'Google',
        lastName: googleUser.lastName ?? 'User',
        role: 'member',
        status: 'active',
      },
    });

    return this.issueSession({
      userId: user.id,
      organizationId: user.organizationId,
      email: user.email,
    });
  }

  buildFrontendAuthRedirectUrl(authResponse: AuthResponse): string {
    const callbackBaseUrl =
      process.env.FRONTEND_AUTH_CALLBACK_URL ??
      'http://localhost:3001/auth/callback';

    const url = new URL(callbackBaseUrl);
    url.searchParams.set('accessToken', authResponse.accessToken);
    url.searchParams.set('refreshToken', authResponse.refreshToken);
    url.searchParams.set('expiresIn', String(authResponse.expiresIn));
    url.searchParams.set('userId', authResponse.user.id);
    url.searchParams.set('email', authResponse.user.email);
    url.searchParams.set('organizationId', authResponse.user.organizationId);

    return url.toString();
  }

  async refresh(dto: RefreshTokenDto): Promise<AuthResponse> {
    const session = await this.prisma.authSession.findUnique({
      where: {
        refreshToken: dto.refreshToken,
      },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.expiresAt <= new Date()) {
      await this.prisma.authSession.delete({
        where: {
          id: session.id,
        },
      });
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.prisma.authSession.delete({
      where: {
        id: session.id,
      },
    });

    const user = await this.prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });

    return this.issueSession({
      userId: session.userId,
      organizationId: session.organizationId,
      email: user?.email ?? `user-${session.userId.toString()}@placeholder.local`,
    });
  }

  private async issueSession(input: {
    userId: bigint;
    organizationId: bigint;
    email: string;
  }): Promise<AuthResponse> {
    const accessToken = randomUUID();
    const refreshToken = randomUUID();
    const expiresIn = 60 * 60;

    await this.prisma.authSession.create({
      data: {
        userId: input.userId,
        organizationId: input.organizationId,
        refreshToken,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn,
      user: {
        id: input.userId.toString(),
        email: input.email,
        organizationId: input.organizationId.toString(),
      },
    };
  }

  private async createOrganizationForRegistration(
    organizationName: string,
  ): Promise<{ id: bigint }> {
    const baseSlug = this.slugify(organizationName);
    const slug = await this.ensureUniqueSlug(baseSlug);

    const organization = await this.prisma.organization.create({
      data: {
        name: organizationName,
        slug,
        industry: 'wedding-photography',
        timezone: 'UTC',
      },
      select: {
        id: true,
      },
    });

    return organization;
  }

  private async ensureOrganizationForGoogle(
    googleUser: GoogleAuthUser,
  ): Promise<{ id: bigint }> {
    const parsedOrganizationId = this.tryParseOrganizationId(
      googleUser.organizationId,
    );

    if (parsedOrganizationId) {
      const existingById = await this.prisma.organization.findUnique({
        where: {
          id: parsedOrganizationId,
        },
        select: {
          id: true,
        },
      });

      if (existingById) {
        return existingById;
      }

      const slug = await this.ensureUniqueSlug(
        this.slugify(`org-${parsedOrganizationId.toString()}`),
      );

      return this.prisma.organization.create({
        data: {
          id: parsedOrganizationId,
          name: `Organization ${parsedOrganizationId.toString()}`,
          slug,
          industry: 'wedding-photography',
          timezone: 'UTC',
        },
        select: {
          id: true,
        },
      });
    }

    const domain = googleUser.email.split('@')[1] ?? 'default-org';
    const domainSlug = this.slugify(domain.replace(/\./g, '-'));

    const existingBySlug = await this.prisma.organization.findUnique({
      where: {
        slug: domainSlug,
      },
      select: {
        id: true,
      },
    });

    if (existingBySlug) {
      return existingBySlug;
    }

    const uniqueSlug = await this.ensureUniqueSlug(domainSlug);

    return this.prisma.organization.create({
      data: {
        name: `${domain} Studio`,
        slug: uniqueSlug,
        industry: 'wedding-photography',
        timezone: 'UTC',
      },
      select: {
        id: true,
      },
    });
  }

  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    const safeBase = baseSlug || 'organization';
    let candidate = safeBase;
    let index = 1;

    while (true) {
      const existing = await this.prisma.organization.findUnique({
        where: {
          slug: candidate,
        },
        select: {
          id: true,
        },
      });

      if (!existing) {
        return candidate;
      }

      candidate = `${safeBase}-${index}`;
      index += 1;
    }
  }

  private tryParseOrganizationId(
    organizationId: string | undefined,
  ): bigint | null {
    if (!organizationId) {
      return null;
    }

    try {
      return toBigIntId(organizationId, 'organization id');
    } catch {
      return null;
    }
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);
  }

  private hashPassword(password: string): string {
    return createHash('sha256').update(password).digest('hex');
  }
}
