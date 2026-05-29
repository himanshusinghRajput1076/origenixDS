import mongoose, { Document, Schema } from 'mongoose';

export interface ISearchLog extends Document {
  query: string;
  userId?: string;
  userName?: string;
  createdAt: Date;
}

const SearchLogSchema: Schema = new Schema(
  {
    query: { type: String, required: true },
    userId: { type: String },
    userName: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<ISearchLog>('SearchLog', SearchLogSchema);
