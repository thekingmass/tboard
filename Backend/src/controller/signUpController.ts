import {Request, Response} from 'express';
import UserModel from '../models/UserModel';
import bcrypt from 'bcrypt';


//POST api/signup
export const signUpController = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        // console.log(req.body);

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Normalize and validate email before querying MongoDB
        const normalizedEmail = String(email).trim().toLowerCase();
        // Lightweight email format check
        const emailRegex = /^[A-Za-z](?:[0-9A-Za-z._-]*[A-Za-z0-9._-])@[A-Za-z]{1,10}\.[A-Za-z]{1,3}$/;
        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }

        // bcrypt cost factor (10-12 are common defaults)
        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 12;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const passwordHash = await bcrypt.hash(String(password), saltRounds);

        // Create new user
        const newUser = new UserModel({
            name,
            email: normalizedEmail,
            passwordHash
        });
        await newUser.save();

        res.status(201).json({ message: "Signup successful" });
    } catch (err) {
        console.error("Error in signup", err);
        res.status(500).json({message: "Internal server error"});
    }
}