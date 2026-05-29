import mongoose, { Document, Schema } from 'mongoose';

export interface IVisit extends Document {
  path: string;
  browser: string;
  device: 'Desktop' | 'Mobile';
  userId?: string;
  userName?: string;
  createdAt: Date;
}

const VisitSchema: Schema = new Schema(
  {
    path: { type: String, required: true },
    browser: { type: String, required: true },
    device: { type: String, enum: ['Desktop', 'Mobile'], required: true },
    userId: { type: String },
    userName: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<IVisit>('Visit', VisitSchema);
