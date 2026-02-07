import { Request, Response } from 'express';
import RefreshSessionModel from '../models/RefreshSessionModel';

import {
  revokeAllActiveRefreshSessionsForUser,
  clearAuthCookies,
} from '../auth/sessionService';

export const logoutController = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.sub;

    if (userId) {
      await revokeAllActiveRefreshSessionsForUser(userId);
    }
    // Clear the access token and refresh token cookie
    clearAuthCookies(req, res);

    return res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    console.error('Error in logout', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}