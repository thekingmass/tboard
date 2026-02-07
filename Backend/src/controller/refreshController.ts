import { Request, Response } from 'express';
import RefreshSessionModel from '../models/RefreshSessionModel';
import UserModel from '../models/UserModel';
import {
  revokeAllActiveRefreshSessionsForUser,
  clearAuthCookies,
  createRefreshSession,
  signAccessTokenForUserId,
  setAccessCookie,
  setRefreshCookie
} from '../auth/sessionService';

import {
  hashToken,
  verifyRefreshToken,
} from '../auth/refresh';

export const refreshController = async (req: Request, res: Response) => {
  try {
    const refreshToken = (req as any).cookies?.refresh_token as string | undefined;

    if (!refreshToken) {

      console.log("Refresh token is missing from the request");

      return res.status(401).json({ message: 'No refresh token' });
    }

    console.log("Refresh token received:");

    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      console.log("Failed to verify refresh token");
      clearAuthCookies(req, res);
      return res.status(401).json({ message: 'Invalid refresh token' });
      
    }
    
    const tokenHash = hashToken(refreshToken);
    // if this refresh token is already revoked or doesn't exist
    const session = await RefreshSessionModel.findOne({ tokenHash, revokedAt: null });

    // Reject if session doesn't exist or doesn't match payload (defense-in-depth)
    if (!session || String(session.userId) !== String(payload.sub) || session.jti !== payload.jti) {
      // Token might be stolen/rotated already. For single-session mode, revoke all sessions.
      console.log("Refresh session invalid or does not match payload, Revoking all sessions for user:", payload.sub);
      await revokeAllActiveRefreshSessionsForUser(payload.sub);

      // Clear cookies(access+refresh) so frontend doesn't loop refresh forever
      clearAuthCookies(req, res);

      console.log("Cleared auth cookies due to invalid refresh session");

      return res.status(401).json({ message: 'Refresh session invalid' });
    }

    // Fetch user so we can embed correct email in access token to avoid the request coming without email in case of unauthorized access, so the system doesnt behave unexpectedly.
    const user = await UserModel.findById(payload.sub);
    if (!user) {
      // User deleted / no longer valid => revoke session and clear cookies
      await revokeAllActiveRefreshSessionsForUser(payload.sub);
      clearAuthCookies(req, res);
      return res.status(401).json({ message: 'User not found' });
    }

    // Rotate refresh token
    
    const newRefreshToken = await createRefreshSession(req, res, { sub: payload.sub }, session);

    setRefreshCookie(res, newRefreshToken.refreshToken);

    //Create new access token
    console.log("Creating new access token for user:", user.email);
    const accessToken = signAccessTokenForUserId(user);

    setAccessCookie(res, accessToken);
  
    return res.status(200).json({ message: 'Refreshed' });

  } catch (err) {
    console.error('Error refreshing token', err);
    clearAuthCookies(req, res);
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};
