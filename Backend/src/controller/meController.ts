import { Request, Response } from 'express';
import UserModel from '../models/UserModel';

// GET /api/me
export const meController = async (req: Request, res: Response) => {
  try {
    const userId = req.auth?.sub;
    if (!userId) {
      console.log("meRoute Not Authenticated: No userId in auth payload");
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await UserModel.findById(userId).select('name email createdAt updatedAt');
    if (!user) {
      console.log("meRoute Not Authenticated: User not found for userId", userId);
      return res.status(401).json({ message: 'Not authenticated' });
    }

    console.log("meRoute sent Success Response for user", user.email);
    return res.json({ user });
    
  } catch (err) {
    console.error('Error in /me', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
