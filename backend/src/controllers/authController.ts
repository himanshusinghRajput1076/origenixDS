import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';
import { mockUserFindOne, mockUserCreate, mockUserFindById, mockUserFindByIdAndUpdate } from '../models/mockDb';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '7d';

// Helper to generate JWT
function generateToken(user: any) {
  const userId = user._id || user.id;
  return jwt.sign({ id: userId, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;
    
    let existing = null;
    if (mongoose.connection.readyState === 1) {
      existing = await User.findOne({ email });
    } else {
      existing = await mockUserFindOne({ email });
    }
    
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.create({ name, email, password, role });
    } else {
      user = await mockUserCreate({ name, email, password, role });
    }
    
    const token = generateToken(user);
    res.status(201).json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    
    let user = null;
    let isMatch = false;
    
    if (mongoose.connection.readyState === 1) {
      user = await User.findOne({ email });
      if (user) {
        isMatch = await user.comparePassword(password);
      }
    } else {
      const mUser = await mockUserFindOne({ email });
      if (mUser) {
        user = mUser;
        isMatch = await bcrypt.compare(password, mUser.passwordHash);
      }
    }
    
    if (!user || !isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore - user is added by protect middleware
    const userId = req.user._id || req.user.id;
    
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(userId).select('-password');
    } else {
      const mUser = await mockUserFindById(userId);
      if (mUser) {
        user = {
          _id: mUser._id,
          id: mUser._id,
          name: mUser.name,
          email: mUser.email,
          role: mUser.role,
        };
      }
    }
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // @ts-ignore - user is added by protect middleware
    const userId = req.user._id || req.user.id;
    const updates = req.body;
    
    let user = null;
    if (mongoose.connection.readyState === 1) {
      user = await User.findByIdAndUpdate(userId, updates, { new: true }).select('-password');
    } else {
      const mUser = await mockUserFindByIdAndUpdate(userId, updates);
      if (mUser) {
        user = {
          _id: mUser._id,
          id: mUser._id,
          name: mUser.name,
          email: mUser.email,
          role: mUser.role,
        };
      }
    }
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

