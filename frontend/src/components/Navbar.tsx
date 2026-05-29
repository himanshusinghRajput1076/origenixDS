import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';
import ButtonLogo from './ButtonLogo';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [techOpen, setTechOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const location = useLocation();
  const [user, setUser] = useState<{ name: string; role: 'admin' | 'client' } | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setTechOpen(false);

    // Dynamic session checks for premium user navigation experience
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser({ name: payload.name || 'User', role: payload.role });
        }
      } catch (err) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <img 
            src="/media/company-logo.png" 
            alt="Origenix Digital Solutions Logo" 
            className="nav-logo-img" 
            style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
          />
          <span className="logo-text" style={{ fontSize: '1.15rem' }}>Origenix Digital Solutions</span>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          <li>
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
          </li>

          {/* Services Dropdown */}
          <li className="has-dropdown"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}>
            <span className={`nav-link dropdown-trigger ${isActive('/services') ? 'active' : ''}`}>
              Services <span className="chevron">›</span>
            </span>
            <div className={`mega-dropdown ${servicesOpen ? 'open' : ''}`}>
              <div className="mega-col">
                <p className="mega-col-title">Tech Services</p>
                <Link to="/services/cloud" className="mega-link">☁️ Cloud Solutions</Link>
                <Link to="/services/ai" className="mega-link">🤖 AI & Machine Learning</Link>
                <Link to="/services/devops" className="mega-link">⚙️ DevOps & CI/CD</Link>
                <Link to="/services/cybersecurity" className="mega-link">🔒 Cybersecurity</Link>
                <Link to="/services/web" className="mega-link">🌐 Web Development</Link>
                <Link to="/services/mobile" className="mega-link">📱 Mobile Apps</Link>
              </div>
              <div className="mega-col">
                <p className="mega-col-title">Digital Marketing</p>
                <Link to="/services/seo" className="mega-link">🔍 SEO Optimization</Link>
                <Link to="/services/social" className="mega-link">📣 Social Media</Link>
                <Link to="/services/content" className="mega-link">✍️ Content Marketing</Link>
                <Link to="/services/ppc" className="mega-link">💰 PPC & Ads</Link>
                <Link to="/services/analytics" className="mega-link">📊 Analytics</Link>
                <Link to="/services/branding" className="mega-link">🎨 Branding</Link>
              </div>
              <div className="mega-col mega-highlight">
                <p className="mega-col-title">Why Origenix?</p>
                <p className="mega-tagline">Crafting exceptional digital solutions with speed, precision, and an elite engineering team.</p>
                <Link to="/contact" className="btn btn-primary" style={{marginTop:'1rem',display:'inline-block'}}><ButtonLogo />Get Free Quote</Link>
              </div>
            </div>
          </li>

          <li>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>About</Link>
          </li>

          {/* Technology Dropdown */}
          <li className="has-dropdown"
            onMouseEnter={() => setTechOpen(true)}
            onMouseLeave={() => setTechOpen(false)}>
            <span className={`nav-link dropdown-trigger ${isActive('/technology') ? 'active' : ''}`}>
              Technology <span className="chevron">›</span>
            </span>
            <div className={`dropdown ${techOpen ? 'open' : ''}`}>
              <Link to="/technology" className="drop-link">🛠️ Tech Stack</Link>
              <Link to="/research" className="drop-link">🔬 Research & Development</Link>
            </div>
          </li>

          <li>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>Contact</Link>
          </li>
        </ul>

        {/* Right Actions */}
        <div className="nav-actions">
          <button className="theme-btn" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                👤 {user.name}
              </span>
              {user.role === 'admin' ? (
                <Link to="/admin" className="btn btn-outline nav-btn" style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', height: 'auto', display: 'flex' }}>
                  Admin Panel
                </Link>
              ) : (
                <Link to="/client" className="btn btn-outline nav-btn" style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', height: 'auto', display: 'flex' }}>
                  Client Portal
                </Link>
              )}
              <button 
                onClick={() => { localStorage.removeItem('token'); setUser(null); window.location.href = '/'; }} 
                className="btn btn-primary nav-btn" 
                style={{ padding: '0.45rem 0.95rem', fontSize: '0.82rem', cursor: 'pointer', height: 'auto' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline nav-btn"><ButtonLogo />Login</Link>
              <Link to="/register" className="btn btn-primary nav-btn"><ButtonLogo />Get Started</Link>
            </>
          )}

          {/* Hamburger */}
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu">
            <span /><span /><span />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <Link to="/" className="mob-link">Home</Link>
        <button className="mob-section" onClick={() => setServicesOpen(!servicesOpen)}>
          Services {servicesOpen ? '▲' : '▼'}
        </button>
        {servicesOpen && (
          <div className="mob-submenu">
            <Link to="/services/cloud" className="mob-sub-link">☁️ Cloud Solutions</Link>
            <Link to="/services/ai" className="mob-sub-link">🤖 AI & ML</Link>
            <Link to="/services/devops" className="mob-sub-link">⚙️ DevOps</Link>
            <Link to="/services/web" className="mob-sub-link">🌐 Web Dev</Link>
            <Link to="/services/seo" className="mob-sub-link">🔍 SEO</Link>
            <Link to="/services/social" className="mob-sub-link">📣 Social Media</Link>
          </div>
        )}
        <Link to="/about" className="mob-link">About</Link>
        <Link to="/technology" className="mob-link">Technology</Link>
        <Link to="/research" className="mob-link">R&D</Link>
        <Link to="/contact" className="mob-link">Contact</Link>
        <div className="mob-auth">
          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'center', padding: '0.5rem 0' }}>
                👤 Hi, {user.name}
              </span>
              {user.role === 'admin' ? (
                <Link to="/admin" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  Admin Panel
                </Link>
              ) : (
                <Link to="/client" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
                  Client Portal
                </Link>
              )}
              <button 
                onClick={() => { localStorage.removeItem('token'); setUser(null); window.location.href = '/'; }} 
                className="btn btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', cursor: 'pointer' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline" style={{width:'100%',justifyContent:'center'}}><ButtonLogo />Login</Link>
              <Link to="/register" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}><ButtonLogo />Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
