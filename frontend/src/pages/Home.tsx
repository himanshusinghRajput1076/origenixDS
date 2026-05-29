import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import '../styles/home.css';
import StarfieldBackground from '../components/StarfieldBackground';
import ButtonLogo from '../components/ButtonLogo';
import DevLifecycle from '../components/DevLifecycle';

/* ═══════════════════════════════════════════════════════
   Startup Growth Engine — replaces the quote list
   ═══════════════════════════════════════════════════════ */

/** Animated number count-up */
function CountUp({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
}

const techStack = ['React','Next.js','Node.js','MongoDB','TypeScript','AWS','Docker','Python','TailwindCSS','PostgreSQL','Redis','Kubernetes','GraphQL','Prisma','OpenAI'];

function StartupGrowthEngine() {
  const metrics = [
    { value: 100, suffix: '%', label: 'Client Retention Rate', icon: '🏆', color: '#f59e0b', sub: 'Every client stays & grows with us' },
    { value: 48,  suffix: 'h', label: 'Avg. Time to First Build', icon: '⚡', color: '#00c6ff', sub: 'From brief to working prototype' },
    { value: 5,   suffix: 'x', label: 'Faster Than Agencies', icon: '🚀', color: '#7b2fff', sub: 'Direct engineers, zero bottlenecks' },
  ];

  const pillars = [
    {
      icon: '🧬', title: 'Zero-to-One Specialists',
      desc: 'Most agencies hand you off to juniors. We have five senior engineers who personally own your product from first sketch to live deployment.',
      badge: 'No Handoffs',
      glow: 'rgba(0,82,204,0.35)',
    },
    {
      icon: '📈', title: 'Built to Scale From Day 1',
      desc: 'We architect for your Series B, not just your MVP. Every line of code is written knowing your startup will 100× — no painful rewrites later.',
      badge: 'Scale-Ready',
      glow: 'rgba(123,47,255,0.35)',
    },
    {
      icon: '🔓', title: 'Full Source Code Ownership',
      desc: 'No vendor lock-in. No black-box tools. You receive full ownership of every file, commit, and deployment pipeline. Your IP stays yours, forever.',
      badge: 'You Own It',
      glow: 'rgba(0,198,255,0.35)',
    },
    {
      icon: '🧠', title: 'AI-Native Engineering',
      desc: 'From GPT-powered features to custom ML pipelines, we embed intelligence into your product — turning raw data into your biggest competitive moat.',
      badge: 'AI-First',
      glow: 'rgba(16,185,129,0.35)',
    },
    {
      icon: '🛡️', title: 'Enterprise-Grade Security',
      desc: 'OWASP Top 10 hardened. JWT + OAuth 2.0. Zero-trust architecture baked in from the first commit — because your users deserve it.',
      badge: 'Secure',
      glow: 'rgba(239,68,68,0.35)',
    },
    {
      icon: '💬', title: 'Direct Founder Access',
      desc: "No account managers or support tickets. Message Sravan directly on WhatsApp. We're your co-founders in the room, not a vendor on a spreadsheet.",
      badge: 'Always Reachable',
      glow: 'rgba(245,158,11,0.35)',
    },
  ];

  return (
    <section style={{ position: 'relative', zIndex: 1, padding: '5rem 0 4rem', overflow: 'hidden' }}>

      {/* Ambient bg orbs */}
      <motion.div animate={{ scale:[1,1.2,1], opacity:[0.08,0.18,0.08] }} transition={{ duration:10, repeat:Infinity }}
        style={{ position:'absolute', top:'-100px', left:'-150px', width:'600px', height:'600px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(0,82,204,0.4) 0%, transparent 70%)', pointerEvents:'none' }} />
      <motion.div animate={{ scale:[1,1.15,1], opacity:[0.06,0.14,0.06] }} transition={{ duration:13, repeat:Infinity, delay:5 }}
        style={{ position:'absolute', bottom:'-80px', right:'-100px', width:'500px', height:'500px', borderRadius:'50%',
          background:'radial-gradient(circle, rgba(123,47,255,0.35) 0%, transparent 70%)', pointerEvents:'none' }} />

      <div className="container" style={{ position:'relative', zIndex:1 }}>

        {/* ── Header ── */}
        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-80px' }}
          transition={{ duration:0.7 }} style={{ textAlign:'center', marginBottom:'3.5rem' }}>
          <p className="section-tag" style={{ marginBottom:'1rem' }}>🚀 Why Startups Choose Us</p>
          <h2 className="section-title" style={{ fontSize:'clamp(1.9rem, 4.5vw, 3rem)', marginBottom:'1rem' }}>
            The <span className="gradient-text">Startup Growth</span> Engine
          </h2>
          <p style={{ color:'var(--text-muted)', fontSize:'clamp(0.95rem, 2vw, 1.1rem)', maxWidth:'580px', margin:'0 auto', lineHeight:1.65 }}>
            We're not just a dev shop. We're the technical co-founders your startup deserves — obsessed with speed, quality, and your growth.
          </p>
        </motion.div>

        {/* ── Animated Metrics ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem', marginBottom:'4rem', maxWidth:'860px', margin:'0 auto 4rem' }}>
          {metrics.map((m, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:30, scale:0.94 }} whileInView={{ opacity:1, y:0, scale:1 }}
              viewport={{ once:true, margin:'-60px' }} transition={{ duration:0.65, delay:i*0.12, ease:[0.22,1,0.36,1] }}
              whileHover={{ y:-6, scale:1.03 }}
              style={{ textAlign:'center', padding:'2rem 1.5rem', borderRadius:'18px',
                background:'rgba(255,255,255,0.035)', border:`1px solid ${m.color}30`,
                backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
                boxShadow:`0 8px 32px ${m.color}18`, position:'relative', overflow:'hidden' }}>
              {/* Glow top bar */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:`linear-gradient(90deg, transparent, ${m.color}, transparent)` }} />
              <div style={{ fontSize:'2.4rem', marginBottom:'0.6rem' }}>{m.icon}</div>
              <div style={{ fontSize:'clamp(2.2rem, 5vw, 3.2rem)', fontWeight:900, lineHeight:1,
                background:`linear-gradient(135deg, ${m.color}, white)`,
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                marginBottom:'0.5rem' }}>
                <CountUp target={m.value} suffix={m.suffix} />
              </div>
              <p style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--text)', margin:'0 0 0.3rem' }}>{m.label}</p>
              <p style={{ fontSize:'0.76rem', color:'var(--text-muted)', margin:0, lineHeight:1.4 }}>{m.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* ── 6 Pillars Grid ── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.25rem', marginBottom:'4rem' }}>
          {pillars.map((p, i) => (
            <motion.div key={i}
              initial={{ opacity:0, y:36, filter:'blur(3px)' }}
              whileInView={{ opacity:1, y:0, filter:'blur(0px)' }}
              viewport={{ once:true, margin:'-50px' }}
              transition={{ duration:0.7, delay:i*0.08, ease:[0.22,1,0.36,1] }}
              whileHover={{ y:-8, boxShadow:`0 20px 50px ${p.glow}`, borderColor:p.glow.replace('0.35','0.5') }}
              style={{ padding:'1.75rem', borderRadius:'16px',
                background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)',
                backdropFilter:'blur(16px)', WebkitBackdropFilter:'blur(16px)',
                transition:'all 0.3s cubic-bezier(0.22,1,0.36,1)', position:'relative', overflow:'hidden' }}>
              {/* Badge */}
              <span style={{ position:'absolute', top:'1rem', right:'1rem',
                fontSize:'0.66rem', fontWeight:700, padding:'0.2rem 0.6rem', borderRadius:'100px',
                background:p.glow.replace('0.35','0.15'), border:`1px solid ${p.glow.replace('0.35','0.4')}`,
                color:p.glow.replace('rgba(','').replace(',0.35)','').split(',').length > 1 ? 'rgba(255,255,255,0.75)' : '#fff',
                letterSpacing:'0.04rem' }}>
                {p.badge}
              </span>
              <div style={{ fontSize:'2.2rem', marginBottom:'1rem' }}>{p.icon}</div>
              <h3 style={{ fontSize:'1.05rem', fontWeight:800, marginBottom:'0.65rem', color:'var(--text)', lineHeight:1.3 }}>{p.title}</h3>
              <p style={{ fontSize:'0.86rem', color:'var(--text-muted)', lineHeight:1.65, margin:0 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* ── Scrolling Tech Stack Marquee ── */}
        <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ duration:0.6 }}
          style={{ marginBottom:'3.5rem', overflow:'hidden', position:'relative' }}>
          <p style={{ textAlign:'center', fontSize:'0.78rem', fontWeight:600, color:'var(--text-muted)',
            letterSpacing:'0.15rem', textTransform:'uppercase', marginBottom:'1rem' }}>Tech Stack We Wield</p>
          <div style={{ position:'relative', overflow:'hidden' }}>
            {/* Fade edges */}
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:'120px', zIndex:2,
              background:'linear-gradient(to right, var(--bg, #08080f), transparent)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', right:0, top:0, bottom:0, width:'120px', zIndex:2,
              background:'linear-gradient(to left, var(--bg, #08080f), transparent)', pointerEvents:'none' }} />
            <motion.div
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration:22, repeat:Infinity, ease:'linear' }}
              style={{ display:'flex', gap:'0.85rem', width:'max-content' }}>
              {[...techStack, ...techStack].map((tech, i) => (
                <span key={i} style={{ whiteSpace:'nowrap', padding:'0.45rem 1.1rem', borderRadius:'100px',
                  background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.09)',
                  fontSize:'0.82rem', fontWeight:600, color:'var(--text-muted)', fontFamily:'monospace' }}>
                  {tech}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Launch CTA Bar ── */}
        <motion.div
          initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true, margin:'-60px' }}
          transition={{ duration:0.7, ease:[0.22,1,0.36,1] }}
          style={{ borderRadius:'20px', padding:'2.5rem 3rem',
            background:'linear-gradient(135deg, rgba(0,82,204,0.18) 0%, rgba(123,47,255,0.18) 50%, rgba(0,198,255,0.12) 100%)',
            border:'1px solid rgba(123,47,255,0.25)',
            boxShadow:'0 0 60px rgba(123,47,255,0.12), 0 0 0 1px rgba(0,198,255,0.08)',
            display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'1.5rem',
            position:'relative', overflow:'hidden' }}>
          {/* Animated pulse glow */}
          <motion.div animate={{ scale:[1,1.4,1], opacity:[0.12,0.22,0.12] }} transition={{ duration:4, repeat:Infinity }}
            style={{ position:'absolute', top:'50%', left:'30%', transform:'translate(-50%,-50%)',
              width:'400px', height:'200px', borderRadius:'50%',
              background:'radial-gradient(ellipse, rgba(123,47,255,0.3) 0%, transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'relative' }}>
            <p style={{ fontSize:'0.82rem', fontWeight:700, color:'rgba(0,198,255,0.85)', textTransform:'uppercase',
              letterSpacing:'0.12rem', marginBottom:'0.4rem' }}>🟢 Currently Accepting New Clients</p>
            <h3 style={{ fontSize:'clamp(1.3rem, 3vw, 1.8rem)', fontWeight:900, color:'var(--text)', margin:'0 0 0.4rem', lineHeight:1.2 }}>
              Your startup's next breakthrough<br />starts with one conversation.
            </h3>
            <p style={{ color:'var(--text-muted)', fontSize:'0.9rem', margin:0 }}>
              No commitment. No sales pressure. Just 30 minutes with a real engineer.
            </p>
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', alignItems:'flex-end', position:'relative' }}>
            <Link to="/contact" className="btn btn-primary" style={{ whiteSpace:'nowrap', padding:'0.9rem 2rem', fontSize:'1rem' }}>
              <ButtonLogo />Book Free Strategy Call
            </Link>
            <p style={{ fontSize:'0.76rem', color:'var(--text-muted)', margin:0, textAlign:'center' }}>
              ⚡ Usually responds within 2 hours
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

const titleContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const titleWord = {
  hidden: { opacity: 0, y: 15, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const }
  }
};


const ctaReveal = {
  hidden: { opacity: 0, scale: 0.94, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { delay: 1.05, duration: 0.5, ease: 'easeOut' as const }
  }
};

const cardReveal = {
  hidden: { opacity: 0, y: 40, scale: 0.96, filter: 'blur(3px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.12,
      duration: 0.85,
      ease: [0.215, 0.61, 0.355, 1] as const, // easeOutCubic
    }
  })
};

const textReveal = {
  hidden: { opacity: 0, y: 25, filter: 'blur(2px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.75, ease: 'easeOut' as const }
  }
};

const TypingGreeting = () => {
  const messages = [
    "Hey! I'm Sravan, founder of Origenix.",
    "Meet Sagar, Himanshu, Krishna & Karan — our elite engineering squad.",
    "We write every line of code with pure human care.",
    "No bloated templates. No vibe coding.",
    "Let's build your next digital product!"
  ];
  
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [blink, setBlink] = useState(true);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (subIndex === messages[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), 2000);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % messages.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 15 : 35);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--primary-light)', fontFamily: 'monospace', lineHeight: 1.4 }}>
      {`${messages[index].substring(0, subIndex)}${blink ? '|' : ' '}`}
    </span>
  );
};

export default function Home() {
  const [showTeamWidget, setShowTeamWidget] = useState(false);

  return (
    <main className="home-page">
      {/* ── BACKGROUND STARFIELD ──────────────── */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
        <StarfieldBackground />
      </div>
      {/* ── HERO ───────────────────────────── */}
      <section className="hero-section" style={{ minHeight: '92vh' }}>
        <motion.div
          className="hero-content"
          initial="hidden"
          animate="visible"
          variants={titleContainer}
        >
          <motion.h1 
            className="hero-title"
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}
          >
            <span style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {"“Fueling the Next Generation".split(" ").map((w, idx) => (
                <motion.span key={idx} variants={titleWord} style={{ display: 'inline-block' }}>{w}</motion.span>
              ))}
            </span>
            <span style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
              <motion.span variants={titleWord} style={{ display: 'inline-block' }}>of</motion.span>
              <motion.span variants={titleWord} className="gradient-text" style={{ display: 'inline-block' }}>Digital</motion.span>
              <motion.span variants={titleWord} className="gradient-text" style={{ display: 'inline-block' }}>Enterprises.”</motion.span>
            </span>
          </motion.h1>

          <motion.p 
            className="hero-subtitle"
            variants={textReveal}
            style={{ 
              fontSize: 'clamp(0.95rem, 2.2vw, 1.2rem)',
              color: 'var(--text-muted)',
              maxWidth: '720px',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginBottom: '2.5rem',
              lineHeight: 1.6,
              fontWeight: 500,
              letterSpacing: '0.2px'
            }}
          >
            We don't ship code — we launch ambitions. Five elite engineers, one relentless standard of excellence.
          </motion.p>

          <motion.div className="hero-cta" variants={ctaReveal} style={{ marginTop: '0rem' }}>
            <Link to="/contact" className="btn btn-primary">
              <ButtonLogo />Start Your Project
            </Link>
            <Link to="/services" className="btn btn-outline">
              <ButtonLogo />Our Services
            </Link>
          </motion.div>
        </motion.div>
        <div className="hero-scroll-hint">
          <span className="scroll-line" />
        </div>
      </section>

      {/* ── MISSION & VISION (FUTURE OF REVOLUTION) ──────────────── */}
      <section className="section mission-vision-section" style={{ position: 'relative', zIndex: 1, paddingBottom: '5rem' }}>
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textReveal}
          >
            <p className="section-tag">The Origenix Manifesto</p>
            <h2 className="section-title">The Future of Digital Craft</h2>
            <p className="section-desc">
              We define a new standard in high-end software craftsmanship. Here is what we stand for.
            </p>
          </motion.div>

          <div className="grid-3">
            {/* Card 1: Mission */}
            <motion.div 
              className="manifesto-card card"
              variants={cardReveal}
              custom={0}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 30px rgba(0, 82, 204, 0.15)', borderColor: 'rgba(0, 82, 204, 0.3)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="manifesto-icon" style={{ fontSize: '2.5rem', marginBottom: '1.25rem', display: 'block' }}>
                🎯
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>Mission</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                “We create powerful digital solutions that solve real business challenges with innovation, creativity, and technology.”
              </p>
            </motion.div>

            {/* Card 2: Vision */}
            <motion.div 
              className="manifesto-card card"
              variants={cardReveal}
              custom={1}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 30px rgba(123, 47, 255, 0.15)', borderColor: 'rgba(123, 47, 255, 0.3)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="manifesto-icon" style={{ fontSize: '2.5rem', marginBottom: '1.25rem', display: 'block' }}>
                👁️
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>Vision</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                “To inspire global digital transformation through next-generation technology and human-centered innovation.”
              </p>
            </motion.div>

            {/* Card 3: Future Innovation */}
            <motion.div 
              className="manifesto-card card"
              variants={cardReveal}
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              whileHover={{ y: -8, scale: 1.02, boxShadow: '0 12px 30px rgba(0, 198, 255, 0.15)', borderColor: 'rgba(0, 198, 255, 0.3)' }}
              transition={{ duration: 0.3 }}
            >
              <div className="manifesto-icon" style={{ fontSize: '2.5rem', marginBottom: '1.25rem', display: 'block' }}>
                ⚡
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--text)' }}>Future Innovation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                “Our future focuses on AI ecosystems, advanced cybersecurity, intelligent business automation, cloud technologies, and scalable SaaS platforms designed for tomorrow’s world.”
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ELITE ENGINEERING SQUAD ──────────────── */}
      <section className="section team-homepage-section" style={{ position: 'relative', zIndex: 1, paddingBottom: '6rem', paddingTop: '1rem' }}>
        <div className="container">
          <motion.div 
            className="section-header"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={textReveal}
          >
            <p className="section-tag">Direct Engineering Partnership</p>
            <h2 className="section-title">Meet the Elite Engineering Squad</h2>
            <p className="section-desc">
              We do not hide behind corporate account managers. We are five sincere developers crafting your high-performance digital future directly alongside you.
            </p>
          </motion.div>

          <div className="grid-5" style={{ marginTop: '3rem' }}>
            {[
              { name: 'Sravan Kumar', role: 'Founder & CEO', img: '/media/sravan-kumar.png', tagline: 'Strategic vision & premium enterprise cloud architecture.' },
              { name: 'Sagar Kushwaha', role: 'Lead Developer', img: '/media/sagar-kushwaha.jpeg', tagline: 'High-scale full-stack builds & resilient environments.' },
              { name: 'Himanshu Singh', role: 'Software Engineer', img: '/media/Himanshhu-Singh.jpeg', tagline: 'Visually stunning, premium interaction design.' },
              { name: 'Krishna Nema', role: 'Software Engineer', img: '/media/krishna-nema.jpeg', tagline: 'High-throughput secure APIs & complex backends.' },
              { name: 'Karan', role: 'Software Engineer', img: '/media/karan.jpeg', tagline: 'Advanced systems automation & cloud DevOps pipelines.' }
            ].map((m, i) => (
              <motion.div 
                key={i}
                className="team-homepage-card card"
                variants={cardReveal}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                whileHover={{ y: -6, scale: 1.02, boxShadow: '0 10px 25px rgba(123, 47, 255, 0.12)', borderColor: 'rgba(123, 47, 255, 0.25)' }}
                transition={{ duration: 0.25 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '1.5rem 1rem',
                  borderRadius: '12px'
                }}
              >
                <div style={{
                  width: '90px',
                  height: '90px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--primary-light)',
                  marginBottom: '1rem',
                  boxShadow: '0 4px 12px rgba(0, 198, 255, 0.15)'
                }}>
                  <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: '0.15rem', color: 'var(--text)' }}>{m.name}</h3>
                <span style={{ fontSize: '0.74rem', color: 'var(--primary-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem', display: 'inline-block' }}>{m.role}</span>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', lineHeight: 1.45 }}>{m.tagline}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STARTUP GROWTH ENGINE ─────────────────────────── */}
      <StartupGrowthEngine />

      {/* ── DEV LIFECYCLE ─────────────────────── */}
      <DevLifecycle />

      {/* ── FOOTER ─────────────────────────── */}
      <footer className="site-footer" style={{ position: 'relative', zIndex: 1 }}>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <span className="footer-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/media/company-logo.png" alt="Logo" style={{ height: '24px', width: 'auto' }} />
                Origenix Digital Solutions
              </span>
              <p style={{ marginBottom: '1.25rem' }}>Empowering digital transformation with cutting-edge technology and hand-crafted engineering excellence.</p>
              <a href="https://origenixdigitalsolution.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-light)', fontSize: '0.88rem', textDecoration: 'none', display: 'block', marginBottom: '0.45rem', fontWeight: 600 }}>
                🌐 origenixdigitalsolution.com
              </a>
              <a href="mailto:business@origenixdigitalsolution.com" style={{ color: 'var(--text-muted)', fontSize: '0.86rem', textDecoration: 'none', display: 'block' }}>
                📧 business@origenixdigitalsolution.com
              </a>
            </div>
            <div className="footer-links">
              <h4>Company</h4>
              <Link to="/about">About</Link>
              <Link to="/services">Services</Link>
              <Link to="/research">R&D</Link>
              <Link to="/contact">Contact</Link>
            </div>
            <div className="footer-links">
              <h4>Connect with Us</h4>
              <a href="https://instagram.com/origenixdigitalsolution" target="_blank" rel="noopener noreferrer">
                📸 Instagram (@origenixdigitalsolution)
              </a>
              <a href="https://github.com/origenix" target="_blank" rel="noopener noreferrer">
                🐙 GitHub (@origenix)
              </a>
              <a href="mailto:business@origenixdigitalsolution.com">
                📩 Direct Inquiry Email
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Origenix Digital Solutions. Crafted with absolute care by Sravan and our squad.</p>
          </div>
        </div>
      </footer>

      {/* ── FLOATING WIDGET ── */}
      <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 9999, pointerEvents: 'auto' }}>
        <motion.button
          onClick={() => setShowTeamWidget(!showTeamWidget)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            background: 'var(--gradient)',
            color: '#fff',
            border: 'none',
            padding: '0.85rem 1.5rem',
            borderRadius: '50px',
            boxShadow: '0 4px 20px rgba(123, 47, 255, 0.4)',
            fontSize: '0.92rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
          }}
        >
          <ButtonLogo /> Meet The Engineers
        </motion.button>

        <AnimatePresence>
          {showTeamWidget && (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: '70px',
                right: '0',
                width: '320px',
                background: 'var(--nav-bg)',
                backdropFilter: 'blur(24px) saturate(1.6)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-hover)',
                color: 'var(--text)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h4 style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text)' }}>Origenix Team Notes</h4>
                <button 
                  onClick={() => setShowTeamWidget(false)}
                  style={{ background: 'transparent', fontSize: '1.4rem', color: 'var(--text-muted)', border: 'none', cursor: 'pointer', lineHeight: 1 }}
                >
                  &times;
                </button>
              </div>
              
              <div style={{ marginBottom: '1.25rem', minHeight: '60px', display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                <TypingGreeting />
              </div>

              <div style={{ display: 'flex', gap: '0.55rem', marginBottom: '1.25rem', justifyContent: 'center' }}>
                {[
                  { name: 'Sravan', role: 'Founder', img: '/media/sravan-kumar.png' },
                  { name: 'Sagar', role: 'Lead Dev', img: '/media/sagar-kushwaha.jpeg' },
                  { name: 'Himanshu', role: 'Dev', img: '/media/Himanshhu-Singh.jpeg' },
                  { name: 'Krishna', role: 'Dev', img: '/media/krishna-nema.jpeg' },
                  { name: 'Karan', role: 'Dev', img: '/media/karan.jpeg' },
                ].map((m, i) => (
                  <div 
                    key={i} 
                    title={`${m.name} (${m.role})`}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--primary-light)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2) translateY(-3px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <img src={m.img} alt={m.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                "No sales reps or corporate templates. Just five engineers building elite digital systems."
              </p>

              <button 
                onClick={() => {
                  setShowTeamWidget(false);
                  window.location.href = '/contact';
                }}
                className="btn btn-primary"
                style={{ width: '100%', padding: '0.6rem', fontSize: '0.88rem', borderRadius: '8px', justifyContent: 'center' }}
              >
                <ButtonLogo />Start Direct Project Chat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
