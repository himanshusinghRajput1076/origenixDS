import React from 'react';

const ButtonLogo: React.FC = () => {
  return (
    <span className="btn-logo-wrap">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="btn-logo-svg">
        <circle cx="12" cy="12" r="4" fill="url(#btn-logo-grad)" />
        <circle cx="12" cy="12" r="9" stroke="url(#btn-logo-grad)" strokeWidth="1.5" strokeDasharray="3 3" />
        <defs>
          <linearGradient id="btn-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00c6ff" />
            <stop offset="100%" stopColor="#7b2fff" />
          </linearGradient>
        </defs>
      </svg>
    </span>
  );
};

export default ButtonLogo;
