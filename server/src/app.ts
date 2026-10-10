import compression from 'compression';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import passport from 'passport';
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

  if (!env.isProd) {
    app.use(morgan('dev'));
  }

  // Passport (OAuth)
  configurePassport();
  app.use(passport.initialize());

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
