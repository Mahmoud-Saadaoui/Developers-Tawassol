import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { getAuthToken, verifyToken } from '../models/User';
import { User } from '../models/User';

export interface AuthRequest extends Request {
  userId?: string;
}

/**
 * Reads the JWT from the httpOnly cookie or Authorization header,
 * verifies it, and attaches userId to the request.
 */
export async function requireAuth(
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const token = getAuthToken(req);
    if (!token) throw ApiError.unauthorized();

    const { id } = verifyToken(token);
    const user = await User.findById(id);
    if (!user) throw ApiError.unauthorized();

    req.userId = id;
    next();
  } catch (err) {
    if (err instanceof ApiError) return next(err);
    return next(ApiError.unauthorized());
  }
}
