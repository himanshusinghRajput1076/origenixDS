import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './PageStyles.css';
import '../styles/home.css';
import VideoPlayer from '../components/VideoPlayer';

const services = [
  {
    title: 'Web Development',
    desc: 'Full-stack MERN, Next.js, and headless CMS solutions built for performance and scale.',
    icon: '🌐',
    techs: ['React', 'Next.js', 'Node.js', 'Express', 'MongoDB', 'TypeScript', 'Tailwind'],
  },
  {
    title: 'Mobile Apps',
    desc: 'React Native and native iOS/Android apps with seamless offline-first experiences.',
    icon: '📱',
    techs: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'SQLite'],
  },
  {
    title: 'Cloud Architecture',
    desc: 'Scalable AWS, Azure & GCP infrastructure — from serverless functions to Kubernetes clusters.',
    icon: '☁️',
    techs: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
  },
  {
    title: 'Digital Marketing',
    desc: 'SEO, paid search, social campaigns and analytics that drive measurable growth.',
    icon: '📈',
    techs: ['Google Analytics (GA4)', 'Meta Pixel', 'SEO Automation', 'Semrush'],
  },
  {
    title: 'AI & Machine Learning',
    desc: 'Custom ML models, NLP pipelines, and computer vision for enterprise automation.',
    icon: '🤖',
    techs: ['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'Hugging Face', 'OpenAI'],
  },
  {
    title: 'Cybersecurity',
    desc: 'Penetration testing, compliance audits, and zero-trust architecture for peace of mind.',
    icon: '🔒',
    techs: ['Zero Trust', 'OWASP Top 10', 'JWT', 'OAuth 2.0', 'SSL/TLS', 'Helmet.js'],
  },
  {
    title: 'Data Analytics',
    desc: 'Real-time dashboards, ETL pipelines, and data lakes that turn raw data into decisions.',
    icon: '📊',
    techs: ['PostgreSQL', 'Redis', 'Apache Spark', 'ETL Pipelines', 'Tableau'],
  },
  {
    title: 'DevOps & CI/CD',
    desc: 'Automated build, test, and deploy pipelines that ship code safely and fast.',
    icon: '⚡',
    techs: ['GitHub Actions', 'Jenkins', 'Linux Bash', 'Nginx', 'Docker Compose', 'PM2'],
  },
];

export default function Services() {
  useScrollReveal();

  return (
    <main>
      {/* ── SERVICES GRID ─────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-tag">What We Do</p>
            <h1 className="section-title">Services That Scale With You</h1>
            <p className="section-desc">
              From concept to deployment, we deliver end-to-end digital solutions
              that drive real business outcomes.
            </p>
          </motion.div>

          <div className="grid-3 reveal-stagger">
            {services.map((svc, i) => (
              <motion.div
                key={i}
                className="service-card card reveal"
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                whileTap={{ scale: 0.98 }}
              >
                <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>{svc.icon}</span>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
                <div className="service-techs" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '1.15rem' }}>
                  {svc.techs.map((t, idx) => (
                    <span
                      key={idx}
                      className="tech-tag"
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-muted)',
                        fontFamily: 'monospace',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO VIDEO SECTION ─────────────────────────────────── */}
      <section
        className="section"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, transparent 0%, rgba(8,8,20,0.97) 25%, rgba(8,8,20,0.97) 75%, transparent 100%)',
          paddingTop: '2rem',
          paddingBottom: '5rem',
        }}
      >
        {/* Ambient orbs */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.24, 0.12] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', top: '-120px', left: '-120px',
            width: '520px', height: '520px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,82,204,0.45) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.22, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          style={{
            position: 'absolute', bottom: '-90px', right: '-90px',
            width: '440px', height: '440px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(123,47,255,0.45) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          {/* Section header */}
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-tag">🎬 Watch In Action</p>
            <h2 className="section-title">
              See What We <span className="gradient-text">Build</span>
            </h2>
            <p className="section-desc">
              A real look at how we craft premium digital experiences — from concept to pixel-perfect delivery.
            </p>
          </motion.div>

          {/* Video player card */}
          <VideoPlayer />
        </div>
      </section>
    </main>
  );
}
