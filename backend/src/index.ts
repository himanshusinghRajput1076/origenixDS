import express from 'express';
import path from 'path';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import adminRoutes from './routes/adminRoutes';
import contactRoutes from './routes/contactRoutes';
import videoRoutes from './routes/videoRoutes';
import researchRoutes from './routes/researchRoutes';
import telemetryRoutes from './routes/telemetryRoutes';
import queryRoutes from './routes/queryRoutes';
import connectDB, { getMongoState } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ─────────────────────────────────────────────────
// GZip compress all responses (cuts payload size by ~70%)
app.use(compression());
const allowedOrigins = [
  // Local development
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  // Production — Firebase Hosting
  'https://origenixdigitalsolution.web.app',
  'https://origenixdigitalsolution.firebaseapp.com',
  // Custom domain
  'https://origenixdigitalsolutions.org',
  'https://www.origenixdigitalsolutions.org',
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server calls (no origin) and listed origins
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin/video', videoRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/telemetry', telemetryRoutes);
app.use('/api/queries', queryRoutes);

// Serve uploaded media files (videos, images) from frontend public folder
app.use('/media', express.static(path.resolve(__dirname, '../../frontend/public/media')));

// ─── Health Checks ──────────────────────────────────────────────
app.get('/', (_req, res) =>
  res.json({ status: 'ok', service: 'Origenix Backend API' })
);

// Real-time MongoDB connection status
app.get('/api/db-status', (_req, res) =>
  res.json({ dbState: getMongoState() })
);

// ─── Start Server ───────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\u{1F680}  Origenix API running on http://localhost:${PORT}`);
});

// ─── Connect to MongoDB (non-blocking, with retry) ──────────────
connectDB();
