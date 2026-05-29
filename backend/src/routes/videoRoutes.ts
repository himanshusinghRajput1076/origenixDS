/**
 * Video Routes — /api/admin/video
 *
 * GET  /api/admin/video         → Public: returns current video metadata
 * POST /api/admin/video/upload  → Admin only: upload a new video file (multipart/form-data)
 * PUT  /api/admin/video/url     → Admin only: set an external URL as the demo video
 */
import { Router, Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import mongoose from 'mongoose';
import { protect } from '../middleware/authMiddleware';
import VideoMeta from '../models/VideoMeta';
import { mockVideoGet, mockVideoUpsert } from '../models/mockVideoDb';

const router = Router();

// ─── Multer Storage Config ───────────────────────────────────────────
// Uploads go to frontend/public/media so they are immediately served by Vite
const UPLOAD_DIR = path.resolve(__dirname, '../../../frontend/public/media');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    // Sanitise filename and prefix with timestamp to avoid cache issues
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `demo_${Date.now()}_${safe}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500 MB max
});

// ─── Helper: isMongoConnected ────────────────────────────────────────
const dbReady = () => mongoose.connection.readyState === 1;

// ─── GET /api/admin/video — Public: fetch current video metadata ──────
router.get('/', async (_req: Request, res: Response) => {
  try {
    if (dbReady()) {
      let meta = await VideoMeta.findOne();
      if (!meta) {
        // Seed default on first call
        meta = await VideoMeta.create({});
      }
      return res.json(meta);
    } else {
      const meta = await mockVideoGet();
      return res.json(meta);
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Failed to fetch video metadata', error: err.message });
  }
});

// ─── POST /api/admin/video/upload — Admin: upload new video file ──────
router.post('/upload', protect, upload.single('video'), async (req: any, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden — Admin access required' });
  }
  if (!req.file) {
    return res.status(400).json({ message: 'No video file provided' });
  }

  const label   = (req.body.label   as string) || 'Origenix — Project Demo';
  const caption = (req.body.caption as string) || 'How we craft premium digital products end to end';
  const url     = `/media/${req.file.filename}`;
  const filename = req.file.originalname;

  try {
    if (dbReady()) {
      const meta = await VideoMeta.findOneAndUpdate(
        {},
        { label, caption, sourceType: 'file', url, filename },
        { upsert: true, new: true }
      );
      return res.json({ message: 'Video uploaded successfully', meta });
    } else {
      const meta = await mockVideoUpsert({ label, caption, sourceType: 'file', url, filename });
      return res.json({ message: 'Video uploaded (mockDb)', meta });
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

// ─── PUT /api/admin/video/url — Admin: set external URL ───────────────
router.put('/url', protect, async (req: any, res: Response) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden — Admin access required' });
  }

  const { url, label, caption } = req.body;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ message: 'url is required' });
  }

  try {
    const updates = {
      url,
      label:      label   || 'Origenix — Project Demo',
      caption:    caption || 'How we craft premium digital products end to end',
      sourceType: 'url' as const,
      filename:   url.split('/').pop() || 'external-video',
    };

    if (dbReady()) {
      const meta = await VideoMeta.findOneAndUpdate({}, updates, { upsert: true, new: true });
      return res.json({ message: 'Video URL updated', meta });
    } else {
      const meta = await mockVideoUpsert(updates);
      return res.json({ message: 'Video URL updated (mockDb)', meta });
    }
  } catch (err: any) {
    return res.status(500).json({ message: 'Update failed', error: err.message });
  }
});

export default router;
