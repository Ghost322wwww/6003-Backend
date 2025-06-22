import { Request, Response } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
const SIGNUP_CODE = process.env.SIGNUP_CODE || 'TRAVEL123';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, username, signupCode } = req.body;

    const role = signupCode === SIGNUP_CODE ? 'operator' : 'user';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already in use' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role }, 
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        _id: newUser._id, 
        username: newUser.username,
        role: newUser.role,
        email: newUser.email,
        avatar: newUser.avatar || "",
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role }, // 用 `id` 給 middleware
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        _id: user._id, 
        username: user.username,
        role: user.role,
        email: user.email,
        avatar: user.avatar || "",
      },
    });
  } catch (err) {
    const error = err as Error;
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const updateData: any = {};
    if (req.body.username) updateData.username = req.body.username;
    if (req.body.password) updateData.password = await bcrypt.hash(req.body.password, 10);
    if (req.file) updateData.avatar = `/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update profile', error: err.message });
  }
};

