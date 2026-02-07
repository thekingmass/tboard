import crypto from 'crypto';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { formatJwtTimesInIST } from "../utils/time";

export type RefreshTokenPayload = {
  sub: string; // user id
  jti: string; // unique id for this refresh token/session
};

function getRefreshSecret(): Secret {
  const secret = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_REFRESH_SECRET (or JWT_SECRET) is not defined in .env');
  return secret;
}

export function generateJti() {
  return crypto.randomBytes(16).toString('hex');
}

export function hashToken(token: string): string {
  // SHA-256 is fine here because refresh tokens have high entropy (JWT signature/random jti)
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']) ?? '1d',
  };

  const rfToken = jwt.sign(payload, getRefreshSecret(), options);

  console.log("Generated and send new Refresh Token:", rfToken);
  const iatIST = formatJwtTimesInIST(jwt.decode(rfToken) as { iat: number; exp: number });
  console.log('Refresh Token times in IST:', iatIST);

  return rfToken;

}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  const isValid = jwt.verify(token, getRefreshSecret(), {
    algorithms: ['HS256'],
  }) as RefreshTokenPayload;

  console.log("Verified Refresh Token payload:", isValid);

  const iatIST = formatJwtTimesInIST(jwt.decode(token) as { iat: number; exp: number });
  console.log('Refresh Token times in IST:', iatIST);

  return isValid;

}

export function refreshCookieOptions(isProd: boolean, maxAgeMs: number) {
  return {
    httpOnly: true as const,
    secure: isProd,
    // Cross-domain cookies require SameSite=None + Secure + HTTPS
    sameSite: (isProd ? 'none' : 'lax') as 'none' | 'lax',
    maxAge: maxAgeMs,
    path: '/',
  };
}
