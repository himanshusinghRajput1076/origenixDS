/**
 * VideoPlayer — Reusable premium video player component.
 * Fetches its source dynamically from the backend via useVideoMeta.
 * Supports file uploads and external URLs set by the admin.
 */
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useVideoMeta } from '../hooks/useVideoMeta';

export default function VideoPlayer() {
  const { meta, loading } = useVideoMeta();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setShowControls(true);
    } else {
      videoRef.current.play();
      setShowControls(false);
    }
    setIsPlaying(!isPlaying);
  };

  // Resolve full video URL — external URLs pass through, local paths prefix backend
  const resolvedUrl = meta.sourceType === 'url'
    ? meta.url
    : meta.url.startsWith('http')
      ? meta.url
      : meta.url; // Vite serves /media/* from public/

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        borderRadius: '22px',
        overflow: 'hidden',
        position: 'relative',
        background: 'rgba(0,0,0,0.65)',
        boxShadow:
          '0 0 0 1px rgba(0,82,204,0.2), 0 40px 100px rgba(0,82,204,0.3), 0 12px 30px rgba(123,47,255,0.2)',
      }}
    >
      {/* Animated rainbow border */}
      <motion.div
        animate={{
          background: [
            'linear-gradient(90deg,#0052cc 0%,#7b2fff 50%,#00c6ff 100%)',
            'linear-gradient(90deg,#00c6ff 0%,#0052cc 50%,#7b2fff 100%)',
            'linear-gradient(90deg,#7b2fff 0%,#00c6ff 50%,#0052cc 100%)',
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        style={{
          position: 'absolute', inset: 0, padding: '2px',
          borderRadius: '22px', zIndex: 2, pointerEvents: 'none',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor', maskComposite: 'exclude',
        }}
      />

      {/* Video */}
      <div
        style={{ position: 'relative', cursor: 'pointer', aspectRatio: '16/9', background: '#000' }}
        onClick={togglePlay}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {loading ? (
          <div style={{
            width: '100%', height: '100%', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem',
          }}>
            Loading video…
          </div>
        ) : (
          <video
            key={resolvedUrl}
            ref={videoRef}
            src={resolvedUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onEnded={() => { setIsPlaying(false); setShowControls(true); }}
            playsInline
          />
        )}

        {/* Play / Pause overlay */}
        <motion.div
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: isPlaying && !showControls ? 'transparent' : 'rgba(0,0,0,0.38)',
            pointerEvents: 'none',
          }}
        >
          {!isPlaying && (
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              style={{
                position: 'absolute', width: '100px', height: '100px',
                borderRadius: '50%', border: '2px solid rgba(0,198,255,0.5)',
              }}
            />
          )}
          <div style={{
            width: '76px', height: '76px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(14px)',
            border: '2px solid rgba(255,255,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 30px rgba(0,198,255,0.35)', pointerEvents: 'auto',
          }}>
            {isPlaying ? (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg width="26" height="26" viewBox="0 0 24 24" fill="white" style={{ marginLeft: '4px' }}>
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            )}
          </div>
        </motion.div>
      </div>

      {/* Caption bar */}
      <div style={{
        padding: '1.25rem 1.85rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.03)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        flexWrap: 'wrap', gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.3rem' }}>🎬</span>
          <div>
            <p style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', margin: 0 }}>
              {meta.label}
            </p>
            <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', margin: 0 }}>
              {meta.caption}
            </p>
          </div>
        </div>
        <motion.span
          animate={{ boxShadow: ['0 0 0px rgba(0,198,255,0)', '0 0 12px rgba(0,198,255,0.4)', '0 0 0px rgba(0,198,255,0)'] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          style={{
            fontSize: '0.72rem', fontWeight: 700, padding: '0.32rem 0.85rem',
            borderRadius: '100px', background: 'rgba(0,198,255,0.1)',
            border: '1px solid rgba(0,198,255,0.3)', color: 'rgba(0,198,255,0.9)',
            letterSpacing: '0.05rem',
          }}
        >
          ● LIVE DEMO
        </motion.span>
      </div>
    </motion.div>
  );
}
