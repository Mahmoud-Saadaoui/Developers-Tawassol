import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { env } from './env';
import { findOrCreateOAuthUser } from '../services/oauthService';

/**
 * Configure Passport OAuth strategies.
 * Each strategy normalizes the profile and finds/creates the user.
 * JWT is issued in the route callback (not here).
 */
export function configurePassport() {
  // ─── Google ───
  if (env.oauth.google.clientId && env.oauth.google.clientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: env.oauth.google.clientId,
          clientSecret: env.oauth.google.clientSecret,
          callbackURL: `${env.serverUrl}/api/auth/google/callback`,
          scope: ['profile', 'email'],
        },
        async (_accessToken, _refreshToken, profile, done) => {
          try {
            const user = await findOrCreateOAuthUser({
              provider: 'google',
              providerId: profile.id,
              name: profile.displayName || profile.username || 'User',
              email: profile.emails?.[0]?.value ?? `${profile.id}@google.oauth`,
              avatarUrl: profile.photos?.[0]?.value,
            });
            done(null, user);
          } catch (err) {
            done(err as Error);
          }
        },
      ),
    );
  }

  // ─── GitHub ───
  if (env.oauth.github.clientId && env.oauth.github.clientSecret) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: env.oauth.github.clientId,
          clientSecret: env.oauth.github.clientSecret,
          callbackURL: `${env.serverUrl}/api/auth/github/callback`,
          scope: ['user:email'],
        },
        async (
          _accessToken: string,
          _refreshToken: string,
          profile: any,
          done: (err: Error | null, user?: unknown) => void,
        ) => {
          try {
            const user = await findOrCreateOAuthUser({
              provider: 'github',
              providerId: String(profile.id),
              name: profile.displayName || profile.username || 'User',
              email: profile.emails?.[0]?.value ?? `${profile.username}@github.oauth`,
              avatarUrl: profile.photos?.[0]?.value,
            });
            done(null, user);
          } catch (err) {
            done(err as Error);
          }
        },
      ),
    );
  }
}
