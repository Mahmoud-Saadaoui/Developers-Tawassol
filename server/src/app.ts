import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import { env } from './config/env';
import { configurePassport } from './config/passport';
import { errorHandler, notFound } from './middleware/errorHandler';
import routes from './routes';

/**
 * Builds the Express app (without starting it).
 * Kept separate from server.ts so it can be imported in tests.
 */
export function createApp() {
  const app = express();

  // Security headers (CSP disabled so Vite HMR works in dev).
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));
  // Parses the httpOnly `token` cookie read by `requireAuth`.
  app.use(cookieParser());

  if (!env.isProd) {
    app.use(morgan('dev'));
  }

  // Short-lived session cookie: only used by Passport to carry the OAuth
  // `state` parameter (CSRF protection). Auth itself is stateless (JWT).
  app.use(
    session({
      secret: env.sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        sameSite: 'lax',
        secure: env.isProd,
        maxAge: 10 * 60 * 1000, // 10 min — enough for the OAuth round-trip
      },
    }),
  );

  // Passport (OAuth)
  configurePassport();
  app.use(passport.initialize());

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
