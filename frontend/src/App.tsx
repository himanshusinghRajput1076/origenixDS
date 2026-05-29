import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import InteractiveSpaceship from './components/InteractiveSpaceship';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import TechStack from './pages/TechStack';
import Research from './pages/Research';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';
import ClientPanel from './pages/ClientPanel';
import { useVisitorTelemetry } from './hooks/useVisitorTelemetry';

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
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />} />
          <Route path="/services/:subservice" element={<Services />} />
          <Route path="/about" element={<About />} />
          <Route path="/technology" element={<TechStack />} />
          <Route path="/research" element={<Research />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/client" element={<ClientPanel />} />
        </Routes>

      </Router>
    </ThemeProvider>
  );
}

export default App;
