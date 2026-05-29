import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FiSend, FiCopy, FiCheck, FiCpu, FiCompass, FiTerminal, FiAlertCircle } from 'react-icons/fi';
import { API_BASE_URL } from '../config';

const researchAreas = [
  {
    title: 'Artificial Intelligence',
    desc: 'Deep learning models, NLP pipelines, and computer vision solutions for enterprise automation.',
    icon: '🧠',
    preset: 'Draft a conceptual architecture for an AI-powered customer support agent that reads a codebase and assists developers.'
  },
  {
    title: 'Blockchain',
    desc: 'Decentralized ledger technologies for supply chain, finance, and identity management.',
    icon: '⛓️',
    preset: 'Explain how Zero-Knowledge Proofs (ZKPs) can be implemented in web-based decentralized user logins.'
  },
  {
    title: 'Edge Computing',
    desc: 'Low-latency processing at the network edge for IoT and real-time analytics.',
    icon: '📡',
    preset: 'What are the best strategies to optimize data synchronization between edge gateways and a centralized MongoDB database?'
  },
  {
    title: 'Quantum Computing',
    desc: 'Exploring quantum algorithms for optimization, cryptography, and simulation problems.',
    icon: '⚛️',
    preset: 'Explain the difference between Quantum Annealing and Gate-Based Quantum Computing in simple terms.'
  },
];

interface Message {
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
}

// Reusable Copyable Code Block
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied code to clipboard');
    } catch {
      toast.error('Failed to copy code');
    }
  };

  return (
    <div style={{
      position: 'relative',
      margin: '1.25rem 0',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      background: 'rgba(10, 10, 18, 0.85)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 1rem',
        background: 'rgba(255, 255, 255, 0.03)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        fontSize: '0.78rem',
        color: 'var(--text-muted)',
        fontFamily: 'monospace'
      }}>
        <span>{language || 'code'}</span>
        <button
          onClick={handleCopy}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'inherit',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            cursor: 'pointer',
            fontSize: '0.75rem',
            padding: '0.2rem 0.5rem',
            borderRadius: '4px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          {copied ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre style={{
        padding: '1.25rem',
        overflowX: 'auto',
        margin: 0,
        fontFamily: '"JetBrains Mono", Consolas, Monaco, monospace',
        fontSize: '0.88rem',
        lineHeight: 1.6,
        color: '#e2e8f0'
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function Research() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'system',
      text: 'Welcome to the Origenix R&D Lab. Ask our AI Assistant any questions about Artificial Intelligence, Blockchain, Edge systems, or Quantum Computing.',
      timestamp: new Date()
    }
  ]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleAskAI = async (promptText: string) => {
    if (!promptText.trim()) return;

    const userMsg: Message = {
      sender: 'user',
      text: promptText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/research/ask`, { prompt: promptText });
      const reply = response.data.text;

      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: reply,
        timestamp: new Date()
      }]);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.error || 'An error occurred while connecting to the AI system. Please check your setup.';
      toast.error('AI Request Failed');
      setMessages(prev => [...prev, {
        sender: 'system',
        text: `Error: ${errMsg}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (presetText: string) => {
    setQuery(presetText);
    const textarea = document.getElementById('ai-query-input');
    if (textarea) {
      textarea.focus();
    }
  };

  // Inline custom Markdown parser helper
  const renderTextWithInlineFormatting = (text: string) => {
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((bp, bpIndex) => {
      if (bp.startsWith('**') && bp.endsWith('**')) {
        return <strong key={bpIndex} style={{ fontWeight: 700, color: 'var(--text)' }}>{bp.slice(2, -2)}</strong>;
      }
      const codeParts = bp.split(/(`.*?`)/g);
      return codeParts.map((cp, cpIndex) => {
        if (cp.startsWith('`') && cp.endsWith('`')) {
          return (
            <code
              key={cpIndex}
              style={{
                fontFamily: '"JetBrains Mono", Consolas, monospace',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '0.15rem 0.4rem',
                borderRadius: '6px',
                fontSize: '0.85em',
                color: 'var(--accent-purple)',
                border: '1px solid rgba(255,255,255,0.05)'
              }}
            >
              {cp.slice(1, -1)}
            </code>
          );
        }
        return cp;
      });
    });
  };

  const parseResponse = (rawText: string) => {
    if (!rawText) return null;
    const parts = rawText.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : '';
        const code = match ? match[2].trim() : part.replace(/```/g, '').trim();
        return <CodeBlock key={index} code={code} language={language} />;
      } else {
        const lines = part.split('\n');
        return (
          <div key={index} style={{ margin: '0.5rem 0' }}>
            {lines.map((line, lIndex) => {
              const trimmed = line.trim();
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return (
                  <li key={lIndex} style={{ marginLeft: '1.5rem', listStyleType: 'disc', margin: '0.4rem 0', color: 'var(--text-muted)' }}>
                    {renderTextWithInlineFormatting(trimmed.slice(2))}
                  </li>
                );
              }
              if (trimmed.match(/^\d+\.\s/)) {
                const content = trimmed.replace(/^\d+\.\s/, '');
                return (
                  <li key={lIndex} style={{ marginLeft: '1.5rem', listStyleType: 'decimal', margin: '0.4rem 0', color: 'var(--text-muted)' }}>
                    {renderTextWithInlineFormatting(content)}
                  </li>
                );
              }
              if (trimmed === '') {
                return <div key={lIndex} style={{ height: '0.6rem' }} />;
              }
              return (
                <p key={lIndex} style={{ margin: '0.4rem 0', lineHeight: 1.65, color: 'var(--text-muted)' }}>
                  {renderTextWithInlineFormatting(line)}
                </p>
              );
            })}
          </div>
        );
      }
    });
  };

  return (
    <motion.section className="section" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} style={{ position: 'relative', overflow: 'hidden' }}>
      
      {/* Background Orbs */}
      <div style={{
        position: 'absolute', top: '10%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(123,47,255,0.08) 0%, transparent 75%)', pointerEvents: 'none', zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '-10%', width: '500px', height: '500px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,198,255,0.08) 0%, transparent 75%)', pointerEvents: 'none', zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        {/* Section Header */}
        <div className="section-header">
          <p className="section-tag">R&D Lab</p>
          <h1 className="section-title">Pushing the Boundaries</h1>
          <p className="section-desc">Explore emerging technologies and chat directly with our AI research engine to build next-generation systems.</p>
        </div>

        {/* Dynamic Preset Cards */}
        <div className="grid-2" style={{ marginBottom: '4rem' }}>
          {researchAreas.map((r, i) => (
            <motion.div
              key={i}
              className="card"
              whileHover={{ y: -6, borderColor: 'var(--primary)' }}
              transition={{ duration: 0.25 }}
              onClick={() => handlePresetClick(r.preset)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: 'rgba(255,255,255,0.015)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)'
              }}
            >
              <div>
                <span style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}>{r.icon}</span>
                <h3 style={{ marginBottom: '0.65rem', fontWeight: 800, fontSize: '1.25rem' }}>{r.title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '1.5rem' }}>{r.desc}</p>
              </div>
              <span style={{
                alignSelf: 'flex-start',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <FiCompass /> Click to Research
              </span>
            </motion.div>
          ))}
        </div>

        {/* AI Research Playground */}
        <div style={{
          background: 'rgba(26, 32, 53, 0.4)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '650px',
          maxWidth: '920px',
          margin: '0 auto'
        }}>
          
          {/* Playground Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1.25rem 2rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            background: 'rgba(10, 14, 26, 0.4)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px', height: '38px', borderRadius: '50%',
                background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <FiCpu style={{ color: '#fff', fontSize: '1.1rem' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>AI Research Engine</h3>
                <p style={{ fontSize: '0.74rem', color: '#10b981', margin: 0, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  Active (Gemini 2.5)
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.8 }}>
              <FiTerminal style={{ color: 'var(--text-muted)' }} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>v2.0-secure</span>
            </div>
          </div>

          {/* Messages Log */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            {messages.map((msg, i) => {
              if (msg.sender === 'system') {
                const isError = msg.text.startsWith('Error:');
                return (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    background: isError ? 'rgba(239, 68, 68, 0.08)' : 'rgba(0, 82, 204, 0.08)',
                    border: `1px solid ${isError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0, 82, 204, 0.15)'}`,
                    alignSelf: 'center',
                    maxWidth: '85%',
                    fontSize: '0.85rem',
                    color: isError ? '#f87171' : 'var(--text-muted)'
                  }}>
                    {isError ? <FiAlertCircle style={{ flexShrink: 0 }} /> : <FiCpu style={{ flexShrink: 0 }} />}
                    <span>{msg.text}</span>
                  </div>
                );
              }

              const isUser = msg.sender === 'user';
              return (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: isUser ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}>
                  <div style={{
                    maxWidth: '82%',
                    padding: '1.25rem 1.6rem',
                    borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                    background: isUser ? 'var(--gradient)' : 'rgba(255, 255, 255, 0.025)',
                    border: isUser ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: isUser ? '0 4px 20px rgba(0, 82, 204, 0.25)' : 'none',
                    color: isUser ? '#fff' : 'var(--text)'
                  }}>
                    {/* Message Sender Details */}
                    <div style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: isUser ? 'rgba(255,255,255,0.7)' : 'var(--accent)',
                      marginBottom: '0.4rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04rem'
                    }}>
                      {isUser ? 'Researcher' : 'AI Engine'}
                    </div>
                    {/* Message Content */}
                    <div style={{ fontSize: '0.94rem', wordBreak: 'break-word' }}>
                      {isUser ? msg.text : parseResponse(msg.text)}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Loading / Typing Indicator */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{ display: 'flex', justifyContent: 'flex-start' }}
                >
                  <div style={{
                    padding: '1.1rem 1.5rem',
                    borderRadius: '20px 20px 20px 4px',
                    background: 'rgba(255, 255, 255, 0.025)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--accent)', marginRight: '0.5rem', textTransform: 'uppercase' }}>Analysing</span>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.2s infinite' }}></span>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.2s infinite 0.2s' }}></span>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.2s infinite 0.4s' }}></span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Query Form Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleAskAI(query); }}
            style={{
              padding: '1.25rem 2rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(10, 14, 26, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            <textarea
              id="ai-query-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAskAI(query);
                }
              }}
              placeholder="Ask the AI research engine to build, debug, or explore concepts..."
              disabled={isLoading}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.035)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '14px',
                padding: '0.85rem 1.25rem',
                color: 'var(--text)',
                fontSize: '0.94rem',
                fontFamily: 'var(--font)',
                outline: 'none',
                resize: 'none',
                height: '48px',
                lineHeight: '22px',
                transition: 'border-color 0.2s, box-shadow 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.boxShadow = '0 0 12px rgba(0, 82, 204, 0.15)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: query.trim() ? 'var(--gradient)' : 'rgba(255,255,255,0.05)',
                color: query.trim() ? '#fff' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: query.trim() ? 'pointer' : 'default',
                transition: 'all 0.25s',
                boxShadow: query.trim() ? '0 4px 15px rgba(0, 82, 204, 0.2)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (query.trim()) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              <FiSend style={{ fontSize: '1.1rem' }} />
            </button>
          </form>
        </div>

      </div>

      {/* Embedded keyframe animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </motion.section>
  );
}
