import mongoose, { Document, Schema } from 'mongoose';

export interface IQuery extends Document {
  clientName: string;
  clientEmail: string;
  title: string;
  description: string;
  status: 'open' | 'resolved';
  response?: string;
  createdAt: Date;
  updatedAt: Date;
}

const QuerySchema: Schema = new Schema(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ['open', 'resolved'], default: 'open' },
    response: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IQuery>('Query', QuerySchema);
