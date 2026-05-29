import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export function useVisitorTelemetry() {
  const location = useLocation();

  useEffect(() => {
    const logVisit = async () => {
      // Capture details
      const path = location.pathname;
      const browser = navigator.userAgent;
      const device = window.innerWidth < 768 ? 'Mobile' : 'Desktop';
      
      const token = localStorage.getItem('token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        await fetch(`${API_BASE_URL}/api/telemetry/visit`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ path, browser, device }),
        });
      } catch (err) {
        // Silently fail telemetry in case backend is down
      }
    };

    logVisit();
  }, [location]); // Fire on every path transition!
}
