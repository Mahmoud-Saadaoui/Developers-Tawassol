import type { Response } from 'express';
import { signToken } from '../models/User';

const COOKIE_NAME = 'token';
const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

export function setAuthCookie(res: Response, userId: string) {
  const token = signToken(userId);
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: MAX_AGE,
    path: '/',
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(COOKIE_NAME, { path: '/' });
}
