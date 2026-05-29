import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Inquiry from '../models/Inquiry';
import { mockInquiryCreate } from '../models/mockDb';

const router = Router();

// @route   POST /api/contact
// @desc    Submit a contact message
// @access  Public
router.post('/', async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const newInquiry = new Inquiry({ name, email, message });
      await newInquiry.save();
      return res.status(201).json({ message: 'Message sent successfully', data: newInquiry });
    } else {
      const mockInquiry = await mockInquiryCreate({ name, email, message });
      return res.status(201).json({ message: 'Message sent successfully (mockDb saved)', data: mockInquiry });
    }
  } catch (error: any) {
    console.error('Contact submission error:', error);
    return res.status(500).json({ message: 'Server error processing contact submission' });
  }
});

export default router;
