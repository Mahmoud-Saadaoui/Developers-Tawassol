import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

/** 404 for unknown routes. */
export function notFound(_req: Request, res: Response) {
  res.status(404).json({ message: 'Route not found' });
}

/** Central error handler — always returns JSON. */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json({ message: err.message, errors: err.errors });
  }

  // Malformed JSON body
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }

  console.error('[error]', err);

  return res.status(500).json({
    message: env.isProd ? 'Internal server error' : (err as Error).message,
  });
}
