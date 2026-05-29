import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Visit from '../models/Visit';
import { mockVisitCreate } from '../models/mockDb';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// @route   POST /api/telemetry/visit
// @desc    Log a new website visit
// @access  Public / Optional Auth
router.post('/visit', async (req: Request, res: Response) => {
  const { path, browser, device } = req.body;

  if (!path || !browser || !device) {
    return res.status(400).json({ message: 'Path, browser, and device are required fields.' });
  }

  // Parse optional authorization to link visit to a registered user
  let userId: string | undefined = undefined;
  let userName: string | undefined = undefined;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string };
      userId = decoded.id;
      userName = decoded.name;
    } catch (err) {
      // Silently ignore invalid tokens for telemetry
    }
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const newVisit = await Visit.create({
        path,
        browser,
        device,
        userId,
        userName,
      });
      return res.status(201).json(newVisit);
    } else {
      const mockVisit = await mockVisitCreate({
        path,
        browser,
        device,
        userId,
        userName,
      });
      return res.status(201).json(mockVisit);
    }
  } catch (error) {
    console.error('Error logging visit telemetry:', error);
    return res.status(500).json({ message: 'Internal server error logging telemetry' });
  }
});

export default router;
