import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../utils/ApiError';

type RequestPart = 'body' | 'query' | 'params';

/**
 * Validates one part of the request against a Zod schema.
 * Parsed (and coerced) data is written back onto the request so that handlers
 * receive typed values (e.g. numeric `page`/`limit` from the query string).
 * On failure → 400 with the Zod field errors.
 *
 * @param schema Zod schema to apply.
 * @param source Which request part to validate (defaults to `body`).
 */
export const validate =
  (schema: ZodSchema, source: RequestPart = 'body') =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return next(ApiError.badRequest('Validation failed', result.error.flatten()));
    }

    if (source === 'query') {
      // Express 4 exposes `req.query` as a plain writable object.
      req.query = result.data as Request['query'];
    } else {
      req[source] = result.data;
    }

    next();
  };
