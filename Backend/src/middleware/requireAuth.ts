import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtUserPayload } from '../auth/jwt';

declare global {
  namespace Express {
    interface Request {
      auth?: JwtUserPayload;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {

    const cookieToken = (req as any).cookies?.access_token as string | undefined;

    if (!cookieToken) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const payload = verifyAccessToken(String(cookieToken));

    if (!payload) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.auth = payload; // Attach payload to req for downstream handlers
    return next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}
