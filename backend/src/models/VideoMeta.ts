/**
 * VideoMeta Model
 * Stores metadata for the current demo video — only ONE document ever exists
 * (upserted), acting as a global config record.
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface IVideoMeta extends Document {
  label: string;          // Display name shown in the admin panel & player caption
  caption: string;        // Sub-caption shown below the label
  sourceType: 'file' | 'url';   // 'file' = uploaded to server, 'url' = external link
  url: string;            // Either the served file path or an external URL
  filename: string;       // Original filename (for display)
  updatedAt: Date;
}

const VideoMetaSchema: Schema = new Schema(
  {
    label:      { type: String, default: 'Origenix — Project Demo' },
    caption:    { type: String, default: 'How we craft premium digital products end to end' },
    sourceType: { type: String, enum: ['file', 'url'], default: 'file' },
    url:        { type: String, default: '/media/demo.mp4' },
    filename:   { type: String, default: 'demo.mp4' },
  },
  { timestamps: true }
);

export default mongoose.model<IVideoMeta>('VideoMeta', VideoMetaSchema);
