/**
 * ═══════════════════════════════════════════════════════════════
 *  Origenix — MERN Database Configuration
 *  File: src/config/database.ts
 *
 *  Handles MongoDB connection with:
 *  - Auto-retry on failure (up to MAX_RETRIES)
 *  - Connection event listeners (connected / disconnected / error)
 *  - Graceful shutdown on SIGINT / SIGTERM
 *  - Exports a typed helper to check connection state
 * ═══════════════════════════════════════════════════════════════
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// ─── Config ────────────────────────────────────────────────────
const MONGO_URI: string =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/origenix';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000; // 3 seconds between retries

let retryCount = 0;

// ─── Connection Options ─────────────────────────────────────────
const mongooseOptions: mongoose.ConnectOptions = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

// ─── Event Listeners ────────────────────────────────────────────
mongoose.connection.on('connected', () => {
  console.log('\u2705  MongoDB connected \u2192', MONGO_URI);
  retryCount = 0;
});

mongoose.connection.on('disconnected', () => {
  console.warn('\u26a0\ufe0f  MongoDB disconnected.');
});

mongoose.connection.on('error', (err: Error) => {
  console.error('\u274c  MongoDB error:', err.message);
});

// ─── Connect Function (with retry) ─────────────────────────────
export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, mongooseOptions);
  } catch (err: any) {
    retryCount += 1;
    console.error(
      `\u274c  MongoDB connection attempt ${retryCount}/${MAX_RETRIES} failed:`,
      err.message
    );

    if (retryCount < MAX_RETRIES) {
      console.log(`\ud83d\udd04  Retrying in ${RETRY_DELAY_MS / 1000}s\u2026`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return connectDB();
    } else {
      console.warn(
        '\u26a0\ufe0f  Max retries reached \u2014 server will run without MongoDB.\n' +
          '    Non-DB endpoints still work. DB-dependent routes will fail gracefully.'
      );
    }
  }
};

// ─── Graceful Shutdown ──────────────────────────────────────────
const gracefulShutdown = async (signal: string) => {
  console.log(`\n\ud83d\uded1  ${signal} received. Closing MongoDB connection\u2026`);
  try {
    await mongoose.connection.close();
    console.log('\u2705  MongoDB connection closed. Exiting.');
  } catch (err: any) {
    console.error('\u274c  Error closing MongoDB connection:', err.message);
  } finally {
    process.exit(0);
  }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// ─── Helpers ────────────────────────────────────────────────────

/**
 * Returns true when MongoDB is fully connected and ready for queries.
 */
export const isMongoConnected = (): boolean =>
  mongoose.connection.readyState === 1;

/**
 * Human-readable connection state.
 * 0 = disconnected | 1 = connected | 2 = connecting | 3 = disconnecting
 */
export const getMongoState = (): string => {
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] ?? 'unknown';
};

export default connectDB;
