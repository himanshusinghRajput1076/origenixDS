import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import '../styles/home.css';
import VideoPlayer from '../components/VideoPlayer';


// Premium glowing SVG components to bypass React 19 / react-icons bundler conflicts
const TargetIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="target-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3b82f6" />
        <stop offset="100%" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#target-grad)" />
    <circle cx="12" cy="12" r="6" stroke="url(#target-grad)" />
    <circle cx="12" cy="12" r="2" stroke="url(#target-grad)" />
  </svg>
);

const HeartIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#f43f5e" />
      </linearGradient>
    </defs>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="url(#heart-grad)" />
  </svg>
);

const GlobeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="globe-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#06b6d4" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="12" r="10" stroke="url(#globe-grad)" />
    <line x1="2" y1="12" x2="22" y2="12" stroke="url(#globe-grad)" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="url(#globe-grad)" />
  </svg>
);

const AwardIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ overflow: 'visible' }}>
    <defs>
      <linearGradient id="award-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>
    <circle cx="12" cy="8" r="7" stroke="url(#award-grad)" />
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" stroke="url(#award-grad)" />
  </svg>
);

const values = [
  { icon: TargetIcon, title: 'Mission-Driven', desc: 'Every project starts with a clear purpose. We build solutions that make a measurable difference.' },
  { icon: HeartIcon, title: 'Human-Centered', desc: 'Technology should serve people. We design experiences that feel natural and intuitive.' },
  { icon: GlobeIcon, title: 'Global Reach', desc: 'From local startups to global systems — we deliver across borders with absolute transparency.' },
  { icon: AwardIcon, title: 'Quality First', desc: 'No shortcuts. Clean code, thorough testing, and honest communication at every step.' },
];

const team = [
  { name: 'Sravan Kumar', role: 'Founder & CEO', photo: '/media/sravan-kumar.png', desc: 'Leading Origenix with a clear vision to deliver premium digital systems and state-of-the-art software systems.' },
  { name: 'Sagar Kushwaha', role: 'Lead Software Engineer', photo: '/media/sagar-kushwaha.jpeg', desc: 'Expert in full-stack architecture, clean code practices, and scalable cloud engineering.' },
  { name: 'Himanshu Singh', role: 'Software Engineer', photo: '/media/Himanshhu-Singh.jpeg', desc: 'Passionate developer specializing in beautiful frontend experiences and complex system integrations.' },
  { name: 'Krishna Nema', role: 'Software Engineer', photo: '/media/krishna-nema.jpeg', desc: 'Focused on high-performance backend pipelines, database efficiency, and API development.' },
  { name: 'Karan', role: 'Software Engineer', photo: '/media/karan.jpeg', desc: 'Specializing in advanced systems development, DevOps automation, and robust enterprise APIs.' },
];

const timeline = [
  { year: '2026', event: 'Origenix Digital Solutions is founded by Sravan Kumar with a handpicked group of elite software engineers: Sagar, Himanshu, Krishna, and Karan. Together, we bring an uncompromising dedication to craft clean, performant, and premium digital solutions.' }
];

export default function About() {
  useScrollReveal();


  return (
    <main>
      {/* Hero */}
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-tag">Who We Are</p>
            <h1 className="section-title">Built by Engineers,<br />Driven by Purpose</h1>
            <p className="section-desc">
              Origenix Digital Solutions is a premium digital transformation firm that blends deep technical expertise
              with genuine care for the people we serve. We're not a factory — we're your partners.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container">
          <div className="section-header reveal">
            <p className="section-tag">Our Values</p>
            <h2 className="section-title">What We Stand For</h2>
          </div>
          <div className="grid-2">
            {values.map((v, i) => (
              <motion.div
                key={i}
                className="why-card reveal"
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
              >
                <div className="service-icon-wrap" style={{ width: 44, height: 44, flexShrink: 0 }}>
                  <v.icon size={20} />
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, marginBottom: '0.35rem' }}>{v.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.65 }}>{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <p className="section-tag">Our Team</p>
            <h2 className="section-title">The Elite Team behind Origenix</h2>
            <p className="section-desc">
              A tight-knit crew of exceptional software engineers and builders dedicated to crafting high-performance digital products.
            </p>
          </div>
          <div className="grid-5 reveal-stagger">
            {team.map((member, i) => (
              <motion.div
                key={i}
                className="card reveal"
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '2rem 1.5rem',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                }}
              >
                <div style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  marginBottom: '1.25rem',
                  border: '3px solid var(--primary-light)',
                  boxShadow: '0 4px 15px rgba(76, 154, 255, 0.2)',
                  background: '#1f2937'
                }}>
                  <img 
                    src={member.photo} 
                    alt={member.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.25rem' }}>{member.name}</h3>
                <p className="badge" style={{ marginBottom: '1rem', padding: '0.2rem 0.65rem' }}>{member.role}</p>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{ background: 'var(--bg-alt)' }}>
        <div className="container" style={{ maxWidth: '720px' }}>
          <div className="section-header reveal">
            <p className="section-tag">Our Journey</p>
            <h2 className="section-title">Where We Started</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {timeline.map((t, i) => (
              <div key={i} className="reveal" style={{
                display: 'flex', gap: '1.25rem', alignItems: 'flex-start',
                padding: '1.25rem', borderRadius: 'var(--radius)',
                border: '1px solid var(--border)', background: 'var(--bg-card)',
              }}>
                <span className="why-number" style={{ minWidth: 52 }}>{t.year}</span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>{t.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO VIDEO ─────────────────────────────────────────── */}
      <section
        className="section"
        style={{
          position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(180deg, transparent 0%, rgba(8,8,22,0.97) 25%, rgba(8,8,22,0.97) 75%, transparent 100%)',
          paddingBottom: '4rem',
        }}
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.22, 0.1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-100px', left: '-100px',
            width: '480px', height: '480px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,82,204,0.4) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{
            position: 'absolute', bottom: '-80px', right: '-80px',
            width: '420px', height: '420px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,47,255,0.4) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-tag">🎬 Our Work In Action</p>
            <h2 className="section-title">Watch Us <span className="gradient-text">Build</span></h2>
            <p className="section-desc">A behind-the-scenes look at how we craft extraordinary digital products.</p>
          </motion.div>

          <VideoPlayer />
        </div>
      </section>

      {/* ── SANSKRIT WISDOM ─────────────────────────────────────── */}
      <section
        className="section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(10,10,20,0.98) 0%, rgba(20,10,35,0.98) 100%)',
          borderTop: '1px solid rgba(123,47,255,0.15)',
          borderBottom: '1px solid rgba(0,198,255,0.1)',
        }}
      >
        {/* Ambient animated orbs */}
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-80px', left: '-80px',
            width: '380px', height: '380px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,47,255,0.35) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.22, 1], opacity: [0.15, 0.28, 0.15] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute', bottom: '-60px', right: '-80px',
            width: '340px', height: '340px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,198,255,0.28) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />
        {/* Gold shimmer center glow */}
        <motion.div
          animate={{ opacity: [0.06, 0.14, 0.06] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px', height: '200px', borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(245,217,138,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: '3rem' }}
          >
            <p className="section-tag" style={{ borderColor: 'rgba(245,217,138,0.3)', color: 'rgba(245,217,138,0.85)' }}>
              ✦ Ancient Wisdom · Modern Purpose ✦
            </p>
          </motion.div>

          {/* Sanskrit Devanagari */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center' }}
          >
            <motion.h2
              initial={{ letterSpacing: '0.8rem', opacity: 0 }}
              whileInView={{ letterSpacing: '0.08rem', opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.15, ease: 'easeOut' }}
              style={{
                fontFamily: '"Noto Serif Devanagari", "Mangal", serif',
                fontSize: 'clamp(2rem, 5vw, 3.4rem)',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #c0a060 0%, #f5d98a 35%, #ffe066 55%, #e8c04a 75%, #b8882a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                lineHeight: 1.55,
                marginBottom: '0',
              }}
            >
              मानवः धर्मः श्रेष्ठः
            </motion.h2>

            {/* Animated shimmer underline */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.6, ease: 'easeOut' }}
              style={{
                height: '2px',
                width: '200px',
                margin: '1.5rem auto',
                background: 'linear-gradient(90deg, transparent 0%, rgba(245,217,138,0.8) 50%, transparent 100%)',
                transformOrigin: 'center',
              }}
            />

            {/* Transliteration */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.75 }}
              style={{
                fontFamily: '"Georgia", "Palatino Linotype", serif',
                fontSize: '1.05rem',
                fontWeight: 500,
                fontStyle: 'italic',
                color: 'rgba(0,198,255,0.7)',
                letterSpacing: '0.18rem',
                marginBottom: '1.5rem',
              }}
            >
              Mānavah Dharmah Śreṣṭhah
            </motion.p>

            {/* Translation */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.95 }}
              style={{
                fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.82)',
                maxWidth: '560px',
                margin: '0 auto 1rem',
                lineHeight: 1.55,
                letterSpacing: '0.01rem',
              }}
            >
              "The highest duty of humanity is righteousness."
            </motion.p>

            {/* Attribution */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.2 }}
              style={{
                fontSize: '0.82rem',
                color: 'rgba(255,255,255,0.3)',
                letterSpacing: '0.12rem',
                textTransform: 'uppercase',
              }}
            >
              — Sanskrit Proverb · The core of Origenix's philosophy
            </motion.p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
