import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import ButtonLogo from '../components/ButtonLogo';
import { API_BASE_URL } from '../config';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API_BASE_URL}/api/contact`, form);
      toast.success('Message sent! Sravan and the team will review this shortly.');
      setForm({ name: '', email: '', message: '' });
    } catch (error: any) {
      console.error('Contact submit error:', error);
      const msg = error?.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(msg);
    } finally {
      setSending(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    padding: '0.85rem 1.15rem',
    borderRadius: 'var(--radius)',
    fontSize: '0.95rem',
    border: '1px solid var(--border)',
    background: 'var(--bg-alt)',
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  };

  return (
    <motion.section 
      className="section" 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.6 }}
      style={{ minHeight: '85vh', display: 'flex', alignItems: 'center' }}
    >
      <div className="container">
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <p className="section-tag">Let's Connect</p>
          <h1 className="section-title">Start a Conversation</h1>
          <p className="section-desc">
            Skip the generic forms and the corporate gates. Talk directly to our squad and build something incredible.
          </p>
        </div>

        <div className="grid-2" style={{ alignItems: 'stretch', gap: '2.5rem' }}>
          {/* Left Column: Direct Coordinates Card */}
          <motion.div 
            className="manifesto-card card"
            style={{
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              borderRadius: '20px',
            }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.75rem' }}>
                <img 
                  src="/media/company-logo.png" 
                  alt="Origenix Logo" 
                  style={{ height: '36px', width: 'auto', objectFit: 'contain' }} 
                />
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text)', margin: 0 }}>
                  Origenix Digital Solutions
                </h2>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', lineHeight: 1.65, marginBottom: '2.5rem' }}>
                We are a dedicated collective of five elite software craftsmen. When you message us, you are not talking to a sales agent — you are starting a direct engineering partnership.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Email */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>📧</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600 }}>Direct Email</span>
                    <a href="mailto:business@origenixdigitalsolution.com" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--primary-light)', wordBreak: 'break-all' }}>
                      business@origenixdigitalsolution.com
                    </a>
                  </div>
                </div>

                {/* Website */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>🌐</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600 }}>Official Site</span>
                    <a href="https://origenixdigitalsolution.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--primary-light)' }}>
                      origenixdigitalsolution.com
                    </a>
                  </div>
                </div>

                {/* Instagram */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>📸</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600 }}>Instagram</span>
                    <a href="https://instagram.com/origenixdigitalsolution" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--primary-light)' }}>
                      @origenixdigitalsolution
                    </a>
                  </div>
                </div>

                {/* GitHub */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: '1.75rem' }}>🐙</span>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', fontWeight: 600 }}>GitHub Organisation</span>
                    <a href="https://github.com/origenix" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--primary-light)' }}>
                      @origenix
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              🤖 Origenix Digital Solutions is registered and operated directly by Sravan Kumar and our elite developers.
            </div>
          </motion.div>

          {/* Right Column: Direct Messaging Form */}
          <motion.div 
            className="manifesto-card card"
            style={{
              padding: '2.5rem',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
          >
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text)' }}>
              Send a Direct Message
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
              Fill in your project ideas below. Sravan, Sagar, Himanshu, Krishna, or Karan will reach out to you within a few hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Name</label>
                <input name="name" placeholder="E.g., John Doe" value={form.name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</label>
                <input name="email" type="email" placeholder="E.g., john@company.com" value={form.email} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tell us about your project</label>
                <textarea name="message" placeholder="What are we building? A Next.js SaaS, high-frequency APIs, or custom AI systems…" value={form.message}
                  onChange={handleChange} required rows={5}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <button type="submit" disabled={sending} className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', opacity: sending ? 0.7 : 1, padding: '0.85rem', marginTop: '0.5rem' }}>
                <ButtonLogo />{sending ? 'Sending to the squad…' : 'Establish Connection'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
