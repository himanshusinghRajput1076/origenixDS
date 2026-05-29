import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import InteractiveSpaceship from './components/InteractiveSpaceship';
import { useVisitorTelemetry } from './hooks/useVisitorTelemetry';

// ── Lazy-load all pages (only downloaded when user visits that page)
const Home       = lazy(() => import('./pages/Home'));
const Services   = lazy(() => import('./pages/Services'));
const About      = lazy(() => import('./pages/About'));
const TechStack  = lazy(() => import('./pages/TechStack'));
const Research   = lazy(() => import('./pages/Research'));
const Contact    = lazy(() => import('./pages/Contact'));
const Login      = lazy(() => import('./pages/Login'));
const Register   = lazy(() => import('./pages/Register'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const ClientPanel = lazy(() => import('./pages/ClientPanel'));

// ── Minimal loader shown while a page chunk loads
function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', color: '#7c3aed', fontSize: '1.1rem', gap: '12px'
    }}>
      <div style={{
        width: 32, height: 32, border: '3px solid #7c3aed44',
        borderTop: '3px solid #7c3aed', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      Loading...
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function TelemetryTracker() {
  useVisitorTelemetry();
  return null;
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <TelemetryTracker />
        <Toaster position="top-center" />
        <Navbar />
        <InteractiveSpaceship />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"                    element={<Home />} />
            <Route path="/services"            element={<Services />} />
            <Route path="/services/:subservice" element={<Services />} />
            <Route path="/about"               element={<About />} />
            <Route path="/technology"          element={<TechStack />} />
            <Route path="/research"            element={<Research />} />
            <Route path="/contact"             element={<Contact />} />
            <Route path="/login"               element={<Login />} />
            <Route path="/register"            element={<Register />} />
            <Route path="/admin"               element={<AdminPanel />} />
            <Route path="/client"              element={<ClientPanel />} />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
