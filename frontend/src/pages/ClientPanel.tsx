import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ButtonLogo from '../components/ButtonLogo';
import { API_BASE_URL } from '../config';

export default function ClientPanel() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [userName, setUserName] = useState('');

  const [activeTab, setActiveTab] = useState<'projects' | 'queries'>('projects');
  const [queries, setQueries] = useState<any[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [submittingQuery, setSubmittingQuery] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role === 'admin') { navigate('/admin'); return; }
      setUserName(payload.name || 'Client');
      setAuthorized(true);
    } catch { navigate('/login'); }
  }, [navigate]);

  const fetchQueries = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setQueriesLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/queries/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQueries(data);
    } catch (error) {
      console.error('Error fetching support queries:', error);
      toast.error('Failed to load support queries.');
    } finally {
      setQueriesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'queries' && authorized) {
      fetchQueries();
    }
  }, [activeTab, authorized]);

  const handleRaiseQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) return;
    setSubmittingQuery(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/queries`,
        { title: newTitle, description: newDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Support query established with engineering team!');
      setNewTitle('');
      setNewDesc('');
      fetchQueries();
    } catch (error) {
      console.error('Error raising support query:', error);
      toast.error('Failed to submit support query.');
    } finally {
      setSubmittingQuery(false);
    }
  };

  if (!authorized) return null;

  const projects: any[] = []; // Starting clean at 0 active projects as requested

  const inputStyle: React.CSSProperties = {
    padding: '0.85rem 1.15rem',
    borderRadius: '12px',
    fontSize: '0.95rem',
    border: '1px solid var(--border)',
    background: 'rgba(255,255,255,0.02)',
    color: 'var(--text)',
    outline: 'none',
    width: '100%',
    fontFamily: 'inherit',
    transition: 'border-color 0.25s, box-shadow 0.25s',
  };

  return (
    <motion.section className="section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="container">
        {/* Profile Header */}
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <div>
            <p className="section-tag">Client Portal</p>
            <h1 className="section-title" style={{ fontSize: '2.5rem', margin: 0 }}>Welcome, {userName}</h1>
            <p className="section-desc">Manage your engineering workspace and communicate with our squad.</p>
          </div>
          <button className="btn btn-outline" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
            <ButtonLogo />Sign Out
          </button>
        </div>

        {/* Tab Selector Bar */}
        <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.1rem', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveTab('projects')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'projects' ? 'var(--primary-light)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: 'pointer',
              paddingBottom: '0.75rem',
              borderBottom: activeTab === 'projects' ? '3px solid var(--primary-light)' : '3px solid transparent',
              transition: 'all 0.25s'
            }}
          >
            🗂️ Active Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('queries')}
            style={{
              background: 'transparent',
              border: 'none',
              color: activeTab === 'queries' ? 'var(--primary-light)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '1.05rem',
              cursor: 'pointer',
              paddingBottom: '0.75rem',
              borderBottom: activeTab === 'queries' ? '3px solid var(--primary-light)' : '3px solid transparent',
              transition: 'all 0.25s'
            }}
          >
            💬 Support Ticket Center ({queries.length})
          </button>
        </div>

        {/* Tab Content Display */}
        <AnimatePresence mode="wait">
          {activeTab === 'projects' ? (
            <motion.div
              key="projects-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {projects.length === 0 ? (
                <div
                  className="card"
                  style={{
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: '20px',
                    maxWidth: '680px',
                    margin: '1rem auto 0 auto',
                  }}
                >
                  <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1.25rem' }}>🚀</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Your Account is Initialized</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2.25rem', fontSize: '0.96rem' }}>
                    Welcome to the squad! Your Origenix client workspace is fully active. You currently have <strong>0</strong> active projects in development. 
                    Ready to build a Next.js SaaS, establish high-throughput edge gates, or consult on custom zero-knowledge verification frameworks?
                  </p>
                  <button
                    onClick={() => navigate('/contact')}
                    className="btn btn-primary"
                    style={{ padding: '0.75rem 2rem', borderRadius: '8px', fontSize: '0.95rem' }}
                  >
                    <ButtonLogo />Initiate Project Inquiry
                  </button>
                </div>
              ) : (
                <div className="grid-3">
                  {projects.map((p, i) => (
                    <div key={i} className="card" style={{ padding: '2rem' }}>
                      <h3 style={{ fontWeight: 800, marginBottom: '0.5rem', fontSize: '1.2rem' }}>{p.name}</h3>
                      <span className="badge" style={{ marginBottom: '1.25rem' }}>{p.status}</span>
                      <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border)', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        <div style={{ height: '100%', width: `${p.progress}%`, borderRadius: '4px', background: 'var(--gradient)', transition: 'width 0.6s ease' }} />
                      </div>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>{p.progress}% Complete</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="queries-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="grid-2"
              style={{ gap: '2.5rem', alignItems: 'stretch' }}
            >
              {/* Left Column: Form to raise tickets */}
              <div className="card" style={{ padding: '2.5rem', borderRadius: '20px', alignSelf: 'start' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>Raise a Technical Query</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginBottom: '1.75rem', lineHeight: 1.5 }}>
                  Need assistance on database architectures, CORS policies, deployment configurations, or secure API access? Type your request below and our engineers will reply directly.
                </p>

                <form onSubmit={handleRaiseQuery} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Query / Ticket Title</label>
                    <input
                      placeholder="E.g., Zero-Knowledge verification compilation error"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Detailed Description</label>
                    <textarea
                      placeholder="Please provide compile logs, code snippets, or architecture requirements..."
                      value={newDesc}
                      onChange={e => setNewDesc(e.target.value)}
                      required
                      rows={5}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submittingQuery || !newTitle.trim() || !newDesc.trim()}
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', opacity: submittingQuery ? 0.7 : 1, padding: '0.85rem', marginTop: '0.5rem' }}
                  >
                    <ButtonLogo />{submittingQuery ? 'Establishing connection…' : 'Submit Ticket to Squad'}
                  </button>
                </form>
              </div>

              {/* Right Column: List of queries */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: '0.5rem 0' }}>Your Query History</h3>
                
                {queriesLoading ? (
                  <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Loading support query log…</div>
                ) : queries.length === 0 ? (
                  <div className="card" style={{ padding: '2.5rem', textAlign: 'center', borderStyle: 'dashed', borderColor: 'var(--border)' }}>
                    <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.75rem' }}>💬</span>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', margin: 0 }}>You have not raised any technical tickets yet. Our direct engineering channel is fully open whenever you need support!</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto', maxHeight: '520px', paddingRight: '0.25rem' }}>
                    {queries.map((q) => {
                      const isResolved = q.status === 'resolved';
                      return (
                        <div key={q._id} className="card" style={{ padding: '1.75rem', border: `1px solid ${isResolved ? 'rgba(16,185,129,0.15)' : 'var(--border)'}`, background: isResolved ? 'rgba(16,185,129,0.015)' : 'var(--bg-card)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <h4 style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0, color: 'var(--text)' }}>{q.title}</h4>
                            <span style={{
                              fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '100px',
                              background: isResolved ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                              border: `1px solid ${isResolved ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                              color: isResolved ? '#10b981' : '#f59e0b',
                              textTransform: 'uppercase', letterSpacing: '0.5px'
                            }}>
                              {q.status}
                            </span>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.55, margin: '0 0 1rem 0', whiteSpace: 'pre-wrap' }}>
                            {q.description}
                          </p>

                          {isResolved && q.response && (
                            <div style={{
                              padding: '1.15rem 1.40rem', borderRadius: '12px',
                              background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)',
                              fontSize: '0.86rem', lineHeight: 1.6, color: '#e2e8f0'
                            }}>
                              <div style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary-light)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                🛡️ Origenix Engineer Reply
                              </div>
                              <div style={{ whiteSpace: 'pre-wrap' }}>{q.response}</div>
                            </div>
                          )}

                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.85rem', fontFamily: 'monospace' }}>
                            Created: {new Date(q.createdAt).toLocaleString()}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
