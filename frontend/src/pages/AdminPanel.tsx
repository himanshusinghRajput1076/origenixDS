import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ButtonLogo from '../components/ButtonLogo';
import { API_BASE_URL } from '../config';

const API = API_BASE_URL;

interface InquiryItem {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}



export default function AdminPanel() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, projects: 0, inquiries: 0, visits: 0, revenue: 0 });
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'video' | 'telemetry' | 'tickets'>('dashboard');

  // ── Video Manager State ──────────────────────────────────────
  const [videoLoading, setVideoLoading] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [urlInput, setUrlInput] = useState('');
  const [labelInput, setLabelInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  // ── Telemetry State ──────────────────────────────────────────
  const [telemetryData, setTelemetryData] = useState<{
    visits: any[];
    searches: any[];
    stats: {
      totalVisits: number;
      desktopVisits: number;
      mobileVisits: number;
      desktopPct: number;
      mobilePct: number;
      pathCounts: Record<string, number>;
    };
  } | null>(null);
  const [telemetryLoading, setTelemetryLoading] = useState(false);

  // ── Tickets State ────────────────────────────────────────────
  const [queries, setQueries] = useState<any[]>([]);
  const [queriesLoading, setQueriesLoading] = useState(false);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionReply, setResolutionReply] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  // Auth + initial fetch
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'admin') { navigate('/client'); return; }
      setAuthorized(true);
    } catch { navigate('/login'); return; }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [statsRes, inquiriesRes, videoRes] = await Promise.all([
          axios.get(`${API}/api/admin/stats`, config),
          axios.get(`${API}/api/admin/inquiries`, config),
          axios.get(`${API}/api/admin/video`),
        ]);
        setStats(statsRes.data);
        setInquiries(inquiriesRes.data);
        const v = videoRes.data;
        setLabelInput(v.label || '');
        setCaptionInput(v.caption || '');
        setUploadMode(v.sourceType || 'file');
        if (v.sourceType === 'url') setUrlInput(v.url || '');
      } catch (error: any) {
        console.error('Error fetching admin data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
        setVideoLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  // Telemetry fetcher
  const fetchTelemetry = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setTelemetryLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API}/api/admin/telemetry`, config);
      setTelemetryData(res.data);
    } catch (error) {
      console.error('Error fetching telemetry:', error);
      toast.error('Failed to load traffic telemetry');
    } finally {
      setTelemetryLoading(false);
    }
  };

  // Queries/tickets fetcher
  const fetchQueries = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    setQueriesLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get(`${API}/api/queries/all`, config);
      setQueries(res.data);
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast.error('Failed to load support queries');
    } finally {
      setQueriesLoading(false);
    }
  };

  // Route/tab listener
  useEffect(() => {
    if (authorized) {
      if (activeTab === 'telemetry') {
        fetchTelemetry();
      } else if (activeTab === 'tickets') {
        fetchQueries();
      }
    }
  }, [activeTab, authorized]);

  // Drag & drop
  useEffect(() => {
    const zone = dropRef.current;
    if (!zone) return;
    const prevent = (e: DragEvent) => e.preventDefault();
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('video/')) handleFileSelect(file);
    };
    zone.addEventListener('dragover', prevent);
    zone.addEventListener('drop', onDrop);
    return () => { zone.removeEventListener('dragover', prevent); zone.removeEventListener('drop', onDrop); };
  }, []);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const objUrl = URL.createObjectURL(file);
    setPreviewUrl(objUrl);
    if (!labelInput) setLabelInput('Origenix — Project Demo');
    if (!captionInput) setCaptionInput('How we craft premium digital products end to end');
  };

  const handleUploadFile = async () => {
    if (!selectedFile) { toast.error('Please select a video file'); return; }
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('label', labelInput);
    formData.append('caption', captionInput);

    setUploading(true);
    setUploadProgress(0);

    try {
      await axios.post(`${API}/api/admin/video/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || selectedFile.size));
          setUploadProgress(percent);
        }
      });
      toast.success('Video uploaded and published live!');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  const handleSetUrl = async () => {
    if (!urlInput.trim()) { toast.error('Please enter a video URL'); return; }
    const token = localStorage.getItem('token');
    setVideoLoading(true);
    try {
      await axios.post(`${API}/api/admin/video/url`, {
        url: urlInput,
        label: labelInput,
        caption: captionInput
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Video source URL updated live!');
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to set URL');
    } finally {
      setVideoLoading(false);
    }
  };

  const handleResolveTicket = async (id: string) => {
    if (!resolutionReply.trim()) return;
    const token = localStorage.getItem('token');
    setSubmittingReply(true);
    try {
      await axios.put(`${API}/api/queries/${id}/resolve`, { response: resolutionReply }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Query resolved and reply dispatched!');
      setResolvingId(null);
      setResolutionReply('');
      fetchQueries();
    } catch (error) {
      console.error('Error resolving query:', error);
      toast.error('Failed to resolve query.');
    } finally {
      setSubmittingReply(false);
    }
  };

  if (!authorized) return null;

  return (
    <motion.section className="section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
      <div className="container">
        {/* Panel Header */}
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
          <div>
            <p className="section-tag">Management Desk</p>
            <h1 className="section-title" style={{ fontSize: '2.5rem', margin: 0 }}>Admin Dashboard</h1>
            <p className="section-desc">Analyze user metrics, telemetry records, support tickets, and update system media.</p>
          </div>
          <button className="btn btn-outline" onClick={() => { localStorage.removeItem('token'); navigate('/'); }}>
            <ButtonLogo />Sign Out
          </button>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', fontSize: '1.2rem', color: 'var(--text-muted)' }}>
            Loading Origenix systems…
          </div>
        ) : (
          <div>
            {/* System metrics cards */}
            <div className="grid-5" style={{ marginBottom: '3rem' }}>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>👥</span>
                <p style={{ margin: 0, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05rem', color: 'var(--text-muted)' }}>Total Users</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{stats.users}</h2>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>🗂️</span>
                <p style={{ margin: 0, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05rem', color: 'var(--text-muted)' }}>Projects</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{stats.projects}</h2>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>📩</span>
                <p style={{ margin: 0, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05rem', color: 'var(--text-muted)' }}>Inquiries</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{stats.inquiries}</h2>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>📈</span>
                <p style={{ margin: 0, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05rem', color: 'var(--text-muted)' }}>Total Visits</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0' }}>{stats.visits}</h2>
              </div>
              <div className="card" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>💰</span>
                <p style={{ margin: 0, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05rem', color: 'var(--text-muted)' }}>Revenue</p>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, margin: '0.2rem 0 0', color: '#10b981' }}>$0</h2>
              </div>
            </div>

            {/* Main Tabs Selector */}
            <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.1rem', marginBottom: '2.5rem' }}>
              {(['dashboard', 'telemetry', 'tickets', 'video'] as const).map((tab) => {
                const labels: Record<string, string> = {
                  dashboard: '📩 General Inquiries',
                  telemetry: '📈 Traffic & AI Telemetry',
                  tickets: '💬 Client Tickets Desk',
                  video: '🎬 Video Showcase Settings',
                };
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      background: 'transparent', border: 'none',
                      color: activeTab === tab ? 'var(--primary-light)' : 'var(--text-muted)',
                      fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', paddingBottom: '0.75rem',
                      borderBottom: activeTab === tab ? '3px solid var(--primary-light)' : '3px solid transparent',
                      transition: 'all 0.25s'
                    }}
                  >
                    {labels[tab]}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTAINER */}
            <AnimatePresence mode="wait">
              {/* TAB: GENERAL INQUIRIES */}
              {activeTab === 'dashboard' && (
                <motion.div key="inquiries-tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Submitted Contact Inquiries</h2>
                  
                  {inquiries.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed', borderColor: 'var(--border)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', margin: 0 }}>No contact inquiries have been received yet.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      {inquiries.map((inq) => (
                        <div key={inq._id} className="card" style={{ padding: '1.75rem', background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>{inq.name}</h3>
                            <a href={`mailto:${inq.email}`} style={{ fontSize: '0.9rem', color: 'var(--primary-light)', fontWeight: 600 }}>{inq.email}</a>
                          </div>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                            {inq.message}
                          </p>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.85rem', fontFamily: 'monospace' }}>
                            Received: {new Date(inq.createdAt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: TELEMETRY & AI SEARCH LOGS */}
              {activeTab === 'telemetry' && (
                <motion.div key="telemetry-tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                  {telemetryLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading telemetry workspace…</div>
                  ) : !telemetryData ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No traffic analytics recorded.</div>
                  ) : (
                    <div>
                      {/* Telemetry charts & stats grid */}
                      <div className="grid-2" style={{ gap: '2.5rem', marginBottom: '3rem' }}>
                        {/* Desktop vs Mobile device breakdown */}
                        <div className="card" style={{ padding: '2.25rem', borderRadius: '20px' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>🖥️ Device Platform Distribution</h3>
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', margin: '0 0 0.4rem', fontWeight: 600 }}>
                                <span>Desktop Views</span>
                                <span style={{ color: 'var(--primary-light)' }}>{telemetryData.stats.desktopVisits} ({telemetryData.stats.desktopPct}%)</span>
                              </p>
                              <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${telemetryData.stats.desktopPct}%`, background: 'var(--gradient)', borderRadius: '5px' }} />
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', margin: '0 0 0.4rem', fontWeight: 600 }}>
                                <span>Mobile Views</span>
                                <span style={{ color: 'var(--accent)' }}>{telemetryData.stats.mobileVisits} ({telemetryData.stats.mobilePct}%)</span>
                              </p>
                              <div style={{ height: '10px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${telemetryData.stats.mobilePct}%`, background: 'var(--accent)', borderRadius: '5px' }} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Visited Page Distribution */}
                        <div className="card" style={{ padding: '2.25rem', borderRadius: '20px' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>📊 Page traffic Distribution</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '180px', overflowY: 'auto' }}>
                            {Object.entries(telemetryData.stats.pathCounts).map(([path, count], idx) => {
                              const pct = Math.round((count / telemetryData.stats.totalVisits) * 100);
                              return (
                                <div key={idx}>
                                  <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', margin: '0 0 0.3rem', fontFamily: 'monospace' }}>
                                    <span>{path}</span>
                                    <span style={{ color: 'var(--text-muted)' }}>{count} views ({pct}%)</span>
                                  </p>
                                  <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: 'rgba(0,198,255,0.65)', borderRadius: '3px' }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Searches and detailed traffic logs split */}
                      <div className="grid-2" style={{ gap: '2.5rem', alignItems: 'stretch' }}>
                        {/* Left Column: AI Search terms */}
                        <div className="card" style={{ padding: '2.25rem', borderRadius: '20px' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>🔍 AI Query Search Logs</h3>
                          
                          {telemetryData.searches.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '3rem' }}>No searches recorded yet.</div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                              {telemetryData.searches.map((s: any, idx: number) => (
                                <div key={idx} style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                  <p style={{ margin: '0 0 0.5rem 0', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)' }}>"{s.query}"</p>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    <span>👤 {s.userName || 'Anonymous Visitor'}</span>
                                    <span>{new Date(s.createdAt).toLocaleString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Right Column: Visited Users details */}
                        <div className="card" style={{ padding: '2.25rem', borderRadius: '20px' }}>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem' }}>📋 Recent Visitor Logs</h3>
                          
                          {telemetryData.visits.length === 0 ? (
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '3rem' }}>No visits logged.</div>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                              {telemetryData.visits.map((v: any, idx: number) => (
                                <div key={idx} style={{ padding: '1rem 1.25rem', background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.25rem' }}>
                                    <span style={{ fontSize: '0.82rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-light)' }}>{v.path}</span>
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{v.device}</span>
                                  </div>
                                  <p style={{ margin: '0 0 0.4rem 0', fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    Agent: {v.browser}
                                  </p>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                                    <span>👤 {v.userName || 'Anonymous'}</span>
                                    <span>{new Date(v.createdAt).toLocaleTimeString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: CLIENT SUPPORT TICKETS */}
              {activeTab === 'tickets' && (
                <motion.div key="tickets-tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Client Technical Tickets Desk</h2>

                  {queriesLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading support desk logs…</div>
                  ) : queries.length === 0 ? (
                    <div className="card" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed', borderColor: 'var(--border)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.96rem', margin: 0 }}>No client queries have been submitted to the support desk.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      {queries.map((q) => {
                        const isResolved = q.status === 'resolved';
                        const isReplying = resolvingId === q._id;

                        return (
                          <div key={q._id} className="card" style={{ padding: '2rem', border: `1px solid ${isResolved ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)'}`, background: isResolved ? 'rgba(16,185,129,0.015)' : 'rgba(245,158,11,0.015)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.75rem' }}>
                              <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem' }}>{q.title}</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                  Raised by: <strong style={{ color: 'var(--text)' }}>{q.clientName}</strong> (<a href={`mailto:${q.clientEmail}`} style={{ color: 'var(--primary-light)' }}>{q.clientEmail}</a>)
                                </p>
                              </div>
                              <span style={{
                                fontSize: '0.68rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '100px',
                                background: isResolved ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                                border: `1px solid ${isResolved ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                                color: isResolved ? '#10b981' : '#f59e0b',
                                textTransform: 'uppercase', letterSpacing: '0.5px', alignSelf: 'start'
                              }}>
                                {q.status}
                              </span>
                            </div>

                            <p style={{ color: '#cbd5e1', fontSize: '0.94rem', lineHeight: 1.6, margin: '1rem 0 1.25rem 0', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.04)', whiteSpace: 'pre-wrap' }}>
                              {q.description}
                            </p>

                            {/* Ticket resolved reply section */}
                            {isResolved && q.response && (
                              <div style={{ padding: '1.25rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '0.88rem', lineHeight: 1.6, color: '#e2e8f0' }}>
                                <div style={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--primary-light)', marginBottom: '0.4rem' }}>
                                  🛡️ Your Engineer Reply
                                </div>
                                <div style={{ whiteSpace: 'pre-wrap' }}>{q.response}</div>
                              </div>
                            )}

                            {/* Ticket response form inline */}
                            {!isResolved && (
                              <div>
                                {!isReplying ? (
                                  <button onClick={() => setResolvingId(q._id)} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                                    ✍️ Compose Reply & Resolve
                                  </button>
                                ) : (
                                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem' }}>
                                    <textarea
                                      placeholder="Type your professional engineering response or support solution..."
                                      value={resolutionReply}
                                      onChange={e => setResolutionReply(e.target.value)}
                                      rows={4}
                                      style={{
                                        width: '100%', padding: '0.85rem 1.15rem', borderRadius: '10px',
                                        fontSize: '0.92rem', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)',
                                        color: '#fff', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box'
                                      }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.85rem' }}>
                                      <button
                                        onClick={() => handleResolveTicket(q._id)}
                                        disabled={submittingReply || !resolutionReply.trim()}
                                        className="btn btn-primary"
                                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem', opacity: submittingReply ? 0.7 : 1 }}
                                      >
                                        <ButtonLogo />{submittingReply ? 'Sending…' : 'Publish Reply & Close Ticket'}
                                      </button>
                                      <button
                                        onClick={() => { setResolvingId(null); setResolutionReply(''); }}
                                        className="btn btn-outline"
                                        style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            )}

                            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1rem', fontFamily: 'monospace' }}>
                              Ticket ID: {q._id} | Opened: {new Date(q.createdAt).toLocaleString()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB: VIDEO PLAYER SETTINGS */}
              {activeTab === 'video' && (
                <motion.div key="video-tab" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.25 }} style={{ maxWidth: '800px', margin: '0 auto' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Dynamic Showcase Video Manager</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.55 }}>
                      Manage the centralized demo showcase video displayed across the platform. You can upload an MP4 file or bind an external URL.
                    </p>

                    {/* Mode toggle */}
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.75rem', background: 'rgba(255,255,255,0.04)', padding: '0.3rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.07)' }}>
                      {(['file', 'url'] as const).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setUploadMode(mode)}
                          style={{
                            flex: 1, padding: '0.55rem', borderRadius: '8px', border: 'none',
                            cursor: 'pointer', fontWeight: 600, fontSize: '0.88rem',
                            background: uploadMode === mode ? 'var(--gradient)' : 'transparent',
                            color: uploadMode === mode ? '#fff' : 'var(--text-muted)',
                            transition: 'all 0.2s',
                          }}
                        >
                          {mode === 'file' ? '📂 Upload File' : '🔗 External URL'}
                        </button>
                      ))}
                    </div>

                    {/* Label & Caption inputs (shared) */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>Video Label</label>
                        <input
                          value={labelInput}
                          onChange={(e) => setLabelInput(e.target.value)}
                          placeholder="Origenix — Project Demo"
                          style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>Caption</label>
                        <input
                          value={captionInput}
                          onChange={(e) => setCaptionInput(e.target.value)}
                          placeholder="How we craft premium digital products"
                          style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '0.9rem', boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    <AnimatePresence mode="wait">
                      {/* FILE UPLOAD MODE */}
                      {uploadMode === 'file' && (
                        <motion.div key="file-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {/* Drag & Drop Zone */}
                          <div
                            ref={dropRef}
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                              border: `2px dashed ${selectedFile ? 'rgba(0,198,255,0.6)' : 'rgba(255,255,255,0.15)'}`,
                              borderRadius: '14px',
                              padding: '2rem 1rem',
                              textAlign: 'center',
                              cursor: 'pointer',
                              background: selectedFile ? 'rgba(0,198,255,0.05)' : 'rgba(255,255,255,0.02)',
                              transition: 'all 0.25s',
                              marginBottom: '1.25rem',
                            }}
                          >
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="video/*"
                              style={{ display: 'none' }}
                              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f); }}
                            />
                            {selectedFile ? (
                              <>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✅</div>
                                <p style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text)', margin: '0 0 0.25rem' }}>{selectedFile.name}</p>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
                              </>
                            ) : (
                              <>
                                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📂</div>
                                <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text)', margin: '0 0 0.25rem' }}>Drop video here or click to browse</p>
                                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>MP4, WebM, MOV — up to 500 MB</p>
                              </>
                            )}
                          </div>

                          {/* Local preview */}
                          {previewUrl && (
                            <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', aspectRatio: '16/9', background: '#000' }}>
                              <video src={previewUrl} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline />
                            </div>
                          )}

                          {/* Progress bar */}
                          {uploading && (
                            <div style={{ marginBottom: '1rem' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Uploading…</span>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-light)' }}>{uploadProgress}%</span>
                              </div>
                              <div style={{ height: '6px', borderRadius: '6px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                                <motion.div
                                  animate={{ width: `${uploadProgress}%` }}
                                  style={{ height: '100%', borderRadius: '6px', background: 'var(--gradient)' }}
                                />
                              </div>
                            </div>
                          )}

                          <button
                            className="btn btn-primary"
                            onClick={handleUploadFile}
                            disabled={!selectedFile || uploading}
                            style={{ width: '100%', justifyContent: 'center', opacity: !selectedFile || uploading ? 0.5 : 1 }}
                          >
                            <ButtonLogo />
                            {uploading ? `Uploading ${uploadProgress}%…` : '🚀 Upload & Publish Video'}
                          </button>
                        </motion.div>
                      )}

                      {/* URL MODE */}
                      {uploadMode === 'url' && (
                        <motion.div key="url-mode" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05rem' }}>
                              Video URL (MP4, YouTube embed, CDN link…)
                            </label>
                            <input
                              value={urlInput}
                              onChange={(e) => setUrlInput(e.target.value)}
                              placeholder="https://example.com/video.mp4"
                              style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: 'var(--text)', fontSize: '0.9rem', boxSizing: 'border-box', fontFamily: 'monospace' }}
                            />
                          </div>

                          {/* URL preview */}
                          {urlInput && (
                            <div style={{ borderRadius: '10px', overflow: 'hidden', marginBottom: '1.25rem', border: '1px solid rgba(255,255,255,0.1)', aspectRatio: '16/9', background: '#000' }}>
                              <video src={urlInput} controls style={{ width: '100%', height: '100%', objectFit: 'cover' }} playsInline />
                            </div>
                          )}

                          <button
                            className="btn btn-primary"
                            onClick={handleSetUrl}
                            disabled={!urlInput.trim() || videoLoading}
                            style={{ width: '100%', justifyContent: 'center', opacity: !urlInput.trim() || videoLoading ? 0.5 : 1 }}
                          >
                            <ButtonLogo />
                            {videoLoading ? 'Saving…' : '🔗 Set URL & Publish'}
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Live preview banner */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    style={{
                      marginTop: '2rem', padding: '1rem 1.5rem', borderRadius: '12px',
                      background: 'rgba(0,198,255,0.06)', border: '1px solid rgba(0,198,255,0.2)',
                      display: 'flex', alignItems: 'center', gap: '0.85rem',
                    }}
                  >
                    <span style={{ fontSize: '1.3rem' }}>ℹ️</span>
                    <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.55 }}>
                      Changes publish instantly — the demo video on <strong style={{ color: 'var(--text)' }}>/services</strong> and <strong style={{ color: 'var(--text)' }}>/about</strong> will update live without any refresh required.
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.section>
  );
}
