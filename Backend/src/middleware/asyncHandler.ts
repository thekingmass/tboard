import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wrap an async Express handler and forward errors to Express error middleware.
 */

export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
