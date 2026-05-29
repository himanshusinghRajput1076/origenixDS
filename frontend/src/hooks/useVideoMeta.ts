/**
 * useVideoMeta — fetches the current demo video metadata from the API.
 * Falls back to the default static /media/demo.mp4 if the API is unreachable.
 */
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export interface VideoMeta {
  label: string;
  caption: string;
  sourceType: 'file' | 'url';
  url: string;
  filename: string;
}

const DEFAULT_META: VideoMeta = {
  label: 'Origenix — Project Demo',
  caption: 'How we craft premium digital products end to end',
  sourceType: 'file',
  url: '/media/demo.mp4',
  filename: 'demo.mp4',
};

export function useVideoMeta() {
  const [meta, setMeta] = useState<VideoMeta>(DEFAULT_META);
  const [loading, setLoading] = useState(true);

  const fetchMeta = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/video`);
      if (res.ok) {
        const data = await res.json();
        setMeta({
          label:      data.label      || DEFAULT_META.label,
          caption:    data.caption    || DEFAULT_META.caption,
          sourceType: data.sourceType || DEFAULT_META.sourceType,
          url:        data.url        || DEFAULT_META.url,
          filename:   data.filename   || DEFAULT_META.filename,
        });
      }
    } catch {
      // API unreachable — use defaults silently
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  return { meta, loading, refetch: fetchMeta };
}
