import { motion } from 'framer-motion';
import { useScrollReveal } from '../hooks/useScrollReveal';
import '../styles/home.css';

const categories = [
  {
    title: 'Frontend',
    techs: [
      { name: 'React', icon: '⚛️' },
      { name: 'Next.js', icon: '▲' },
      { name: 'TypeScript', icon: '🔷' },
      { name: 'Tailwind CSS', icon: '🎨' },
    ],
  },
  {
    title: 'Backend',
    techs: [
      { name: 'Node.js', icon: '🟢' },
      { name: 'Express', icon: '⚡' },
      { name: 'Python', icon: '🐍' },
      { name: 'GraphQL', icon: '◈' },
    ],
  },
  {
    title: 'Database & Cloud',
    techs: [
      { name: 'MongoDB', icon: '🍃' },
      { name: 'PostgreSQL', icon: '🐘' },
      { name: 'AWS', icon: '☁️' },
      { name: 'Docker', icon: '🐳' },
    ],
  },
  {
    title: 'AI & DevOps',
    techs: [
      { name: 'TensorFlow', icon: '🧠' },
      { name: 'Kubernetes', icon: '☸️' },
      { name: 'GitHub Actions', icon: '🔄' },
      { name: 'Redis', icon: '🔴' },
    ],
  },
];

export default function TechStack() {
  useScrollReveal();

  return (
    <main>
      <section className="section" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="section-tag">Technology</p>
            <h1 className="section-title">Our Tech Stack</h1>
            <p className="section-desc">
              We pick the right tool for every job — battle-tested technologies
              that scale with your business.
            </p>
          </motion.div>

          <div className="grid-2">
            {categories.map((cat, i) => (
              <div key={i} className="card reveal">
                <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1.05rem' }}>{cat.title}</h3>
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem',
                }}>
                  {cat.techs.map((t, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center', gap: '0.6rem',
                      padding: '0.6rem 0.75rem', borderRadius: '8px',
                      border: '1px solid var(--border)', background: 'var(--bg-alt)',
                      fontSize: '0.88rem', fontWeight: 500,
                      transition: 'border-color 0.25s ease, transform 0.25s ease',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary-light)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      <span style={{ fontSize: '1.15rem' }}>{t.icon}</span>
                      {t.name}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
