import React, { useEffect, useState } from 'react';

const MobileCta = ({ onBookNow }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Slight delay so animation plays after initial render
    const t = setTimeout(() => setAnimate(true), 250);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`mobile-cta ${animate ? 'entrance' : ''}`}
      role="region"
      aria-label="Quick actions"
      aria-live="polite"
    >
      <a className="mobile-cta-btn call" href="tel:+14802555887" aria-label="Call Scottsdale Handyman">📞 Call</a>
      <button type="button" className="mobile-cta-btn book" onClick={() => onBookNow && onBookNow(null)} aria-label="Book free estimate">🗓️ Book</button>
      <a className="mobile-cta-btn chat" href="#chat" aria-label="Open chat">💬 Chat</a>
    </div>
  );
};

export default MobileCta;
