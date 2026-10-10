import { Router, type Request, type Response } from 'express';
import passport from 'passport';
import { env } from '../config/env';
import { setAuthCookie } from '../utils/cookies';

const router = Router();

/** Redirect back to the client after OAuth success. */
function redirectToClient(res: Response, success: boolean) {
  const url = `${env.clientUrl}/oauth/callback?success=${success ? 1 : 0}`;
  res.redirect(url);
}

/* ─── Google ─── */

router.get('/google', (req, res, next) => {
  if (!env.oauth.google.clientId) {
    return res.status(501).json({ message: 'Google OAuth not configured' });
  }
  passport.authenticate('google', { scope: ['profile', 'email'], state: true } as any)(req, res, next);
});

router.get(
  '/google/callback',
  (req, res, next) => {
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${env.clientUrl}/oauth/callback?success=0`,
    } as any)(req, res, next);
  },
  (req: Request, res: Response) => {
    const user = req.user as { id: string };
    setAuthCookie(res, user.id);
    redirectToClient(res, true);
  },
);

/* ─── GitHub ─── */

router.get('/github', (req, res, next) => {
  if (!env.oauth.github.clientId) {
    return res.status(501).json({ message: 'GitHub OAuth not configured' });
  }
  passport.authenticate('github', { scope: ['user:email'], state: true } as any)(req, res, next);
});

router.get(
  '/github/callback',
  (req, res, next) => {
    passport.authenticate('github', {
      session: false,
      failureRedirect: `${env.clientUrl}/oauth/callback?success=0`,
    } as any)(req, res, next);
  },
  (req: Request, res: Response) => {
    const user = req.user as { id: string };
    setAuthCookie(res, user.id);
    redirectToClient(res, true);
  },
);

/* ─── LinkedIn ─── */

router.get('/linkedin', (req, res, next) => {
  if (!env.oauth.linkedin.clientId) {
    return res.status(501).json({ message: 'LinkedIn OAuth not configured' });
  }
  passport.authenticate('linkedin', { state: true } as any)(req, res, next);
});

router.get(
  '/linkedin/callback',
  (req, res, next) => {
    passport.authenticate('linkedin', {
      session: false,
      failureRedirect: `${env.clientUrl}/oauth/callback?success=0`,
    } as any)(req, res, next);
  },
  (req: Request, res: Response) => {
    const user = req.user as { id: string };
    setAuthCookie(res, user.id);
    redirectToClient(res, true);
  },
);

export default router;
