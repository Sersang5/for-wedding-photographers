import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { VerifyCallback } from 'passport-google-oauth20';
import { Profile, Strategy } from 'passport-google-oauth20';
import { GoogleAuthUser } from '../../application/interfaces/google-auth-user.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID ?? 'missing-google-client-id',
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ?? 'missing-google-client-secret',
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ??
        'http://localhost:3000/api/auth/google/callback',
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  validate(
    req: {
      query?: Record<string, string | string[] | undefined>;
    },
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): void {
    const email = profile.emails?.[0]?.value;

    if (!email) {
      done(new UnauthorizedException('Google account email not available'), false);
      return;
    }

    const state = req.query?.state;
    const organizationId = Array.isArray(state) ? state[0] : state;

    const user: GoogleAuthUser = {
      googleId: profile.id,
      email,
      firstName: profile.name?.givenName,
      lastName: profile.name?.familyName,
      organizationId,
    };

    done(null, user);
  }
}