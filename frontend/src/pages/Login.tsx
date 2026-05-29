import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ButtonLogo from '../components/ButtonLogo';
import { API_BASE_URL } from '../config';


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const token = data.token;
      localStorage.setItem('token', token);
      const payload = JSON.parse(atob(token.split('.')[1]));
      toast.success('Welcome back!');
      if (payload.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/client');
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '80vh', padding: '2rem 1.25rem'
    }}>
      <h2 style={{ marginBottom: '0.5rem', fontSize: '2rem', fontWeight: 700 }}>Welcome Back</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Sign in to your Origenix account</p>

      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem 1rem',
          borderRadius: '8px', marginBottom: '1rem', width: '100%', maxWidth: '340px', textAlign: 'center',
          border: '1px solid rgba(239,68,68,0.2)', fontSize: '0.9rem'
        }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} style={{
        display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '340px', gap: '0.85rem',
      }}>
        <input type="email" placeholder="Email address" value={email}
          onChange={e => setEmail(e.target.value)} required
          style={{
            padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '16px',
            border: '1px solid var(--border)', background: 'var(--bg-alt)', color: 'var(--text)',
            outline: 'none', transition: 'border-color 0.2s',
          }}
        />
        <input type="password" placeholder="Password" value={password}
          onChange={e => setPassword(e.target.value)} required
          style={{
            padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '16px',
            border: '1px solid var(--border)', background: 'var(--bg-alt)', color: 'var(--text)',
            outline: 'none', transition: 'border-color 0.2s',
          }}
        />
        <button type="submit" disabled={loading} className="btn btn-primary"
          style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
          <ButtonLogo />{loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
      <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
