import type { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/validation';

/**
 * Centralized error handler for controllers wrapped in asyncHandler.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : 'Internal server error';

  return res.status(statusCode).json({ message });
}
