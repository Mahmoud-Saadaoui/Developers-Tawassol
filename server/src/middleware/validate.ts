import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Validates req.body against a Zod schema.
 * On failure → 400 with the Zod field errors.
 */
export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', result.error.flatten()));
    }
    next();
  };
