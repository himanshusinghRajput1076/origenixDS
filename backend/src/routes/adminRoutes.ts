import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware';
import User from '../models/User';
import Inquiry from '../models/Inquiry';
import Visit from '../models/Visit';
import SearchLog from '../models/SearchLog';
import {
  mockUserCount,
  mockInquiryCount,
  mockProjectCount,
  mockInquiryFindAll,
  mockVisitFindAll,
  mockVisitCount,
  mockSearchLogFindAll
} from '../models/mockDb';

const router = Router();

// @route   GET /api/admin/stats
// @desc    Get dashboard metrics and counts
// @access  Admin Private
router.get('/stats', protect, async (req: any, res: Response) => {
  // Ensure the caller is an admin
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden — Admin access required' });
  }

  try {
    let users = 0;
    let inquiries = 0;
    let projects = 0;
    let visits = 0;

    if (mongoose.connection.readyState === 1) {
      users = await User.countDocuments();
      inquiries = await Inquiry.countDocuments();
      projects = 0;
      visits = await Visit.countDocuments();
    } else {
      users = await mockUserCount();
      inquiries = await mockInquiryCount();
      projects = await mockProjectCount();
      visits = await mockVisitCount();
    }

    return res.json({
      users,
      projects,
      inquiries,
      visits,
      revenue: 0, // Honest starting point
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

// @route   GET /api/admin/inquiries
// @desc    Get all submitted contact inquiries
// @access  Admin Private
router.get('/inquiries', protect, async (req: any, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden — Admin access required' });
  }

  try {
    if (mongoose.connection.readyState === 1) {
      const dbInquiries = await Inquiry.find().sort({ createdAt: -1 });
      return res.json(dbInquiries);
    } else {
      const mockInquiries = await mockInquiryFindAll();
      // Reverse to show latest first
      return res.json([...mockInquiries].reverse());
      }
  } catch (error) {
    console.error('Error fetching inquiries:', error);
    return res.status(500).json({ message: 'Server error fetching contact inquiries' });
  }
});

// @route   GET /api/admin/telemetry
// @desc    Get client traffic analytics and search logs
// @access  Admin Private
router.get('/telemetry', protect, async (req: any, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden — Admin access required' });
  }

  try {
    let visits = [];
    let searches = [];

    if (mongoose.connection.readyState === 1) {
      visits = await Visit.find().sort({ createdAt: -1 }).limit(100);
      searches = await SearchLog.find().sort({ createdAt: -1 }).limit(100);
    } else {
      const mockVisits = await mockVisitFindAll();
      const mockSearches = await mockSearchLogFindAll();
      visits = [...mockVisits].reverse();
      searches = [...mockSearches].reverse();
    }

    // Generate basic aggregate statistics for client charts
    const totalVisits = visits.length;
    const desktopVisits = visits.filter(v => v.device === 'Desktop').length;
    const mobileVisits = visits.filter(v => v.device === 'Mobile').length;

    // Page view distributions
    const pathCounts: Record<string, number> = {};
    visits.forEach(v => {
      pathCounts[v.path] = (pathCounts[v.path] || 0) + 1;
    });

    return res.json({
      visits,
      searches,
      stats: {
        totalVisits,
        desktopVisits,
        mobileVisits,
        desktopPct: totalVisits > 0 ? Math.round((desktopVisits / totalVisits) * 100) : 0,
        mobilePct: totalVisits > 0 ? Math.round((mobileVisits / totalVisits) * 100) : 0,
        pathCounts,
      }
    });
  } catch (error) {
    console.error('Error fetching telemetry metrics:', error);
    return res.status(500).json({ message: 'Server error loading telemetry' });
  }
});

export default router;
