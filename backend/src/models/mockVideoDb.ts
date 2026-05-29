/**
 * In-memory fallback for VideoMeta (used when MongoDB is not connected).
 * Mirrors the Mongoose model interface so all controllers stay identical.
 */

export interface IMockVideoMeta {
  _id: string;
  label: string;
  caption: string;
  sourceType: 'file' | 'url';
  url: string;
  filename: string;
  updatedAt: Date;
}

let mockVideo: IMockVideoMeta = {
  _id: 'mock-video-meta',
  label: 'Origenix — Project Demo',
  caption: 'How we craft premium digital products end to end',
  sourceType: 'file',
  url: '/media/demo.mp4',
  filename: 'demo.mp4',
  updatedAt: new Date(),
};

export const mockVideoGet = async (): Promise<IMockVideoMeta> => mockVideo;

export const mockVideoUpsert = async (updates: Partial<IMockVideoMeta>): Promise<IMockVideoMeta> => {
  mockVideo = { ...mockVideo, ...updates, updatedAt: new Date() };
  return mockVideo;
};
