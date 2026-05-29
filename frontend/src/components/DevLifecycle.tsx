import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import '../styles/devlifecycle.css';

/* ─── Phase data ─────────────────────────────────────── */
interface Phase {
  step: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: string[];
  duration: string;
  color: string;
  glow: string;
  accent: string;
  who: string; // which engineer owns this
}

const phases: Phase[] = [
  {
    step: '01',
    icon: '🤝',
    title: 'Discovery & Alignment',
    tagline: 'We listen before we type a single line.',
    description:
      'Sravan personally hops on a 30-minute strategy call to understand your vision, constraints, and success metrics. No cookie-cutter questionnaires — just a real conversation between people who care.',
    deliverables: ['Project Brief', 'Goal Map', 'Scope Definition', 'Timeline Estimate'],
    duration: '1–2 Days',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.18)',
    accent: '#fbbf24',
    who: 'Sravan (Founder)',
  },
  {
    step: '02',
    icon: '🎨',
    title: 'Architecture & Design',
    tagline: 'Systems that think before pixels are placed.',
    description:
      'Himanshu crafts high-fidelity UI/UX prototypes while our team architects a scalable technical blueprint. You see exactly what you\'re getting — interactive, not just pretty mockups.',
    deliverables: ['System Architecture', 'Figma Prototypes', 'DB Schema', 'API Blueprint'],
    duration: '3–5 Days',
    color: '#7b2fff',
    glow: 'rgba(123,47,255,0.18)',
    accent: '#a855f7',
    who: 'Himanshu + Sravan',
  },
  {
    step: '03',
    icon: '⚡',
    title: 'Sprint Development',
    tagline: 'Clean code. Real humans. Zero shortcuts.',
    description:
      'Sagar leads the full-stack build in focused 1-week sprints. Every line is reviewed, every component is tested. We ship working software every Friday — not promises.',
    deliverables: ['Working Features', 'Unit Tests', 'Code Reviews', 'Weekly Demo'],
    duration: '2–6 Weeks',
    color: '#00c6ff',
    glow: 'rgba(0,198,255,0.18)',
    accent: '#22d3ee',
    who: 'Sagar + Krishna + Karan',
  },
  {
    step: '04',
    icon: '🔒',
    title: 'Quality & Security',
    tagline: 'We break it before attackers can.',
    description:
      'Krishna runs OWASP-hardened security audits while our QA process covers edge cases, load testing, and cross-device compatibility. Your product is ready for real-world chaos.',
    deliverables: ['Security Audit', 'Performance Benchmark', 'Bug Report', 'QA Sign-off'],
    duration: '3–5 Days',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.18)',
    accent: '#f87171',
    who: 'Krishna + Full Team',
  },
  {
    step: '05',
    icon: '🚀',
    title: 'Deployment & Launch',
    tagline: 'We don\'t just push to prod — we go live together.',
    description:
      'Karan configures CI/CD pipelines, Docker containers, and cloud infrastructure. We deploy with you, monitor the first hours live, and celebrate your launch as partners — not vendors.',
    deliverables: ['Production Deploy', 'CI/CD Pipeline', 'Monitoring Setup', 'Rollback Plan'],
    duration: '1–3 Days',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.18)',
    accent: '#34d399',
    who: 'Karan + Sagar',
  },
  {
    step: '06',
    icon: '🌱',
    title: 'Growth & Evolution',
    tagline: 'Your success is where our work truly begins.',
    description:
      'Post-launch, Sravan stays in your corner. Analytics reviews, feature iterations, scaling support — we\'re a long-term partner invested in your growth, not a one-off project shop.',
    deliverables: ['Analytics Report', 'Feature Roadmap', 'Scaling Plan', 'Monthly Check-ins'],
    duration: 'Ongoing',
    color: '#0052cc',
    glow: 'rgba(0,82,204,0.18)',
    accent: '#4c9aff',
    who: 'Sravan + Full Team',
  },
];

/* ─── Phase Card ─────────────────────────────────────── */
function PhaseCard({ phase, index, isActive, onClick }: {
  phase: Phase;
  index: number;
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className={`dlc-card ${isActive ? 'dlc-card--active' : ''}`}
      style={
        {
          '--card-color': phase.color,
          '--card-glow': phase.glow,
          '--card-accent': phase.accent,
        } as React.CSSProperties
      }
      onClick={onClick}
      whileHover={{ y: -6 }}
    >
      {/* Step number watermark */}
      <span className="dlc-card__watermark">{phase.step}</span>

      {/* Top row */}
      <div className="dlc-card__header">
        <span className="dlc-card__icon">{phase.icon}</span>
        <div className="dlc-card__meta">
          <span className="dlc-card__step">Phase {phase.step}</span>
          <span className="dlc-card__duration">{phase.duration}</span>
        </div>
      </div>

      <h3 className="dlc-card__title">{phase.title}</h3>
      <p className="dlc-card__tagline">"{phase.tagline}"</p>

      {/* Expanded detail */}
      <motion.div
        className="dlc-card__detail"
        initial={false}
        animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <p className="dlc-card__desc">{phase.description}</p>

        <div className="dlc-card__deliverables">
          <p className="dlc-card__deliverables-label">What you receive:</p>
          <div className="dlc-card__chips">
            {phase.deliverables.map((d, i) => (
              <span key={i} className="dlc-chip">{d}</span>
            ))}
          </div>
        </div>

        <p className="dlc-card__who">
          <span className="dlc-card__who-label">Owned by:</span> {phase.who}
        </p>
      </motion.div>

      {/* Bottom indicator */}
      <div className="dlc-card__footer">
        <span className="dlc-card__toggle">
          {isActive ? '▲ Less detail' : '▼ See detail'}
        </span>
      </div>

      {/* Active glow bar */}
      <div className="dlc-card__glow-bar" />
    </motion.div>
  );
}

/* ─── Main Section ───────────────────────────────────── */
export default function DevLifecycle() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-80px' });

  const handleClick = (i: number) => {
    setActiveIndex(prev => (prev === i ? null : i));
  };

  return (
    <section className="dlc-section">
      {/* Ambient orbs */}
      <motion.div
        className="dlc-orb dlc-orb--left"
        animate={{ scale: [1, 1.3, 1], opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div
        className="dlc-orb dlc-orb--right"
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 9, repeat: Infinity, delay: 4 }}
      />

      <div className="container">
        {/* ── Header ── */}
        <motion.div
          ref={headerRef}
          className="dlc-header"
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75 }}
        >
          <p className="section-tag">🛠 How We Build Together</p>
          <h2 className="section-title">
            Our <span className="gradient-text">Development Journey</span>
          </h2>
          <p className="section-desc">
            Six deliberate phases. Real engineers at every step. No hand-offs, no black boxes —
            just transparent collaboration from first sketch to final launch.
          </p>

          {/* Human promise bar */}
          <motion.div
            className="dlc-promise"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={headerInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {['No Vibe Coding', 'Human Crafted', 'Full Transparency', 'Direct Access'].map((t, i) => (
              <span key={i} className="dlc-promise__tag">
                <span className="dlc-promise__dot" /> {t}
              </span>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Timeline connector (decorative) ── */}
        <div className="dlc-timeline-line" aria-hidden="true">
          <div className="dlc-timeline-line__fill" />
        </div>

        {/* ── Cards Grid ── */}
        <div className="dlc-grid">
          {phases.map((phase, i) => (
            <PhaseCard
              key={i}
              phase={phase}
              index={i}
              isActive={activeIndex === i}
              onClick={() => handleClick(i)}
            />
          ))}
        </div>

        {/* ── Bottom CTA ── */}
        <motion.div
          className="dlc-cta"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
        >
          <div className="dlc-cta__pulse" />
          <p className="dlc-cta__eyebrow">✋ Curious how this maps to your project?</p>
          <h3 className="dlc-cta__heading">
            Let's walk through your build, together.
          </h3>
          <p className="dlc-cta__sub">
            Sravan will personally map these phases to your product — free, no commitment.
          </p>
          <a href="/contact" className="btn btn-primary">
            Book a Free Walkthrough Call →
          </a>
        </motion.div>
      </div>
    </section>
  );
}
