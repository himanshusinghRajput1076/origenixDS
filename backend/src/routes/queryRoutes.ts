import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware';
import Query from '../models/Query';
import {
  mockQueryCreate,
  mockQueryFindAll,
  mockQueryFindAllByClientEmail,
  mockQueryFindByIdAndResolve,
} from '../models/mockDb';

const router = Router();

// @route   POST /api/queries
// @desc    Raise a new technical/business support query
// @access  Client Private
router.post('/', protect, async (req: any, res: Response) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required.' });
  }

  try {
    const clientName = req.user.name;
    const clientEmail = req.user.email;

    if (mongoose.connection.readyState === 1) {
      const newQuery = await Query.create({
        clientName,
        clientEmail,
        title,
        description,
        status: 'open',
      });
      return res.status(201).json(newQuery);
    } else {
      const mockQuery = await mockQueryCreate({
        clientName,
        clientEmail,
        title,
        description,
      });
      return res.status(201).json(mockQuery);
    }
  } catch (error) {
    console.error('Error creating support query:', error);
    return res.status(500).json({ message: 'Server error raising support query' });
  }
});

// @route   GET /api/queries/my
// @desc    Get all queries raised by the logged-in client
// @access  Client Private
router.get('/my', protect, async (req: any, res: Response) => {
  try {
    const clientEmail = req.user.email;

    if (mongoose.connection.readyState === 1) {
      const dbQueries = await Query.find({ clientEmail }).sort({ createdAt: -1 });
      return res.json(dbQueries);
    } else {
      const mockQueries = await mockQueryFindAllByClientEmail(clientEmail);
      return res.json([...mockQueries].reverse());
    }
  } catch (error) {
    console.error('Error fetching client queries:', error);
    return res.status(500).json({ message: 'Server error fetching your queries' });
  }
});

// @route   GET /api/queries/all
// @desc    Get all raised support queries in the system
// @access  Admin Private
router.get('/all', protect, async (req: any, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden — Admin access required' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const dbQueries = await Query.find().sort({ createdAt: -1 });
      return res.json(dbQueries);
    } else {
      const mockQueries = await mockQueryFindAll();
      return res.json([...mockQueries].reverse());
    }
  } catch (error) {
    console.error('Error fetching all queries:', error);
    return res.status(500).json({ message: 'Server error fetching all queries' });
  }
});

// @route   PUT /api/queries/:id/resolve
// @desc    Respond and resolve a support query
// @access  Admin Private
router.put('/:id/resolve', protect, async (req: any, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden — Admin access required' });
  }

  const { response } = req.body;
  if (!response || !response.trim()) {
    return res.status(400).json({ message: 'Resolution response content is required.' });
  }

  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      const query = await Query.findById(id);
      if (!query) {
        return res.status(404).json({ message: 'Support query not found.' });
      }
      query.response = response;
      query.status = 'resolved';
      await query.save();
      return res.json(query);
    } else {
      const mockQuery = await mockQueryFindByIdAndResolve(id, response);
      if (!mockQuery) {
        return res.status(404).json({ message: 'Support query not found.' });
      }
      return res.json(mockQuery);
    }
  } catch (error) {
    console.error('Error resolving support query:', error);
    return res.status(500).json({ message: 'Server error resolving support query' });
  }
});

export default router;
