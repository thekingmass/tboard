import { Request, Response } from 'express';
import UserModel from '../models/UserModel';
import bcrypt from 'bcrypt';

import {
    signAccessTokenForUserId,
    revokeAllActiveRefreshSessionsForUser,
    createRefreshSession,
    setAccessCookie,
    setRefreshCookie
} from '../auth/sessionService';


//POST api/login
export const loginController = async (req: Request, res: Response) => {
    try {
        const { loginEmail, loginPassword } = req.body;
        // console.log("Login attempt:", loginEmail, loginPassword);

        if (!loginEmail || !loginPassword) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = String(loginEmail).trim().toLowerCase();

        // Find user by email
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(loginPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create JWT access token 
        const accessToken = signAccessTokenForUserId(user)

        if (!accessToken) {
            return res.status(500).json({ message: 'Could not create access token' });
        }

        // Successful login

        // Single-device policy: revoke any existing refresh sessions for this user
        // (revokedAt: null)= the session is active 
        await revokeAllActiveRefreshSessionsForUser(user.id);

        // Creating Login session and Refresh Token
        const newRefreshToken = await createRefreshSession(req, res, { sub: user.id }, null);

        // Sending access_token via httpOnly cookie
        setAccessCookie(res, accessToken);
        setRefreshCookie(res, newRefreshToken.refreshToken);

        res.status(200).json({ message: 'Login successful', name: user.name });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
