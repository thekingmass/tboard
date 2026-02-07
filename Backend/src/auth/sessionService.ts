import { Request, Response } from 'express';
import RefreshSessionModel from '../models/RefreshSessionModel';
import type { RefreshSession } from '../models/RefreshSessionModel';
import {
    generateJti,
    hashToken,
    signRefreshToken,
    refreshCookieOptions
} from '../auth/refresh';

import { signAccessToken } from '../auth/jwt';

const isProd = process.env.NODE_ENV === 'production';

export function revokeAllActiveRefreshSessionsForUser(userId: string) {

    console.log("Revoking all active refresh sessions for user:", userId);

    return RefreshSessionModel.updateMany(
        { userId, revokedAt: null },
        { $set: { revokedAt: new Date() } }
    );
}

export function clearAuthCookies(req: Request, res: Response) {

    console.log("Clearing auth cookies");

    res.clearCookie('access_token', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
    });
    res.clearCookie('refresh_token', {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        path: '/',
    });
}


export async function createRefreshSession(
    req: Request,
    res: Response,
    payload: { sub: string },
    session?: (RefreshSession & { save: () => Promise<unknown> }) | null ) 
    {
    
        console.log("Creating new refresh session for user:", payload.sub);
    const refreshExpiresMs = getRefreshCookieExpiresInMs();

    // Rotate: revoke the old session (if provided) and mint a new refresh token/session.
    const newJti = generateJti();
    const newRefreshToken = signRefreshToken({ sub: payload.sub, jti: newJti });
    const newTokenHash = hashToken(newRefreshToken);

    if (session) {
        // Best-effort revoke (caller already checked that session belongs to payload)
        (session as any).revokedAt = new Date();
        (session as any).replacedByJti = newJti;
        await session.save();
    }

    const createdSession = await RefreshSessionModel.create({
        userId: payload.sub,
        jti: newJti,
        tokenHash: newTokenHash,
        expiresAt: new Date(Date.now() + refreshExpiresMs),
        revokedAt: null,
        userAgent: req.get('user-agent') ?? null,
        ip: req.ip ?? null,
    });

    // Return details in case a controller wants them (useful for testing/logging).
    return {
        refreshToken: newRefreshToken,
        jti: newJti,
        session: createdSession,
    };
}

export function signAccessTokenForUserId(user: { id: string; email: string }) {
    return signAccessToken({ sub: user.id, email: user.email });

}

export function getAccessCookieMaxAgeMs() {
    return (() => {
        const raw = process.env.COOKIE_MAX_AGE_MS;
        if (!raw) return 15 * 60 * 1000;
        const n = Number(raw);
        return Number.isFinite(n) && n >= 0 ? n : 15 * 60 * 1000;
    })();
}

export function getRefreshCookieMaxAgeMs() {
    return (() => {
        const raw = process.env.REFRESH_COOKIE_MAX_AGE_MS;
        if (!raw) return 1 * 24 * 60 * 60 * 1000; // 1d
        const n = Number(raw);
        return Number.isFinite(n) && n >= 0 ? n : 1 * 24 * 60 * 60 * 1000;
    })();
}

export function getRefreshCookieExpiresInMs() {
    return (() => {
        const raw = process.env.JWT_REFRESH_EXPIRES_IN;
        if (!raw) return 1 * 24 * 60 * 60 * 1000; // 1d
        const n = Number(raw);
        return Number.isFinite(n) && n >= 0 ? n : 1 * 24 * 60 * 60 * 1000;
    })();
}

export function setAccessCookie(res: Response, accessToken: string) {
    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? 'none' : 'lax',
        maxAge: getAccessCookieMaxAgeMs(),
        path: '/',
    });
}

export function setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie('refresh_token', refreshToken, refreshCookieOptions(isProd, getRefreshCookieMaxAgeMs()));
}

