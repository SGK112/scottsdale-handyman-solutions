import React from 'react';
import { Phone, Mail, MapPin, Clock, Menu, X, Lock } from './icons.jsx';

export default function Header({ onProPortalClick, onWorkWithUsClick }) {
  // mobile-first header: remove hamburger and expose app-like quick actions
  return (
    <header className="header">
      <div className="header-main">
        <div className="container header-content">
          <a href="/" className="logo" aria-label="Scottsdale Handyman Solutions">
            <div className="logo-icon"><span>🔧</span></div>
            <div className="logo-text">
              <h1>Scottsdale Handyman</h1>
            </div>
          </a>

          {/* App-like quick actions on the right (mobile-first). Chat button triggers global event 'openChat' */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <a href="tel:+14802555887" className="menu-action" aria-label="Call us" style={{ textDecoration: 'none' }}>
              <button className="cta-button-nav" style={{ padding: '0.5rem 0.9rem' }}>📞 Call</button>
            </a>

            <button className="menu-action" onClick={() => (onWorkWithUsClick ? onWorkWithUsClick() : window.location.href = '#contact')} aria-label="Get a free quote" style={{ padding: '0.5rem 0.9rem' }}>
              <span className="cta-button-nav">Get Quote</span>
            </button>

            <button className="menu-action" onClick={() => window.dispatchEvent(new CustomEvent('openChat'))} aria-label="Open chat" style={{ padding: '0.5rem', borderRadius: 10 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>💬 Chat</span>
            </button>
          </div>

          {/* Desktop navigation remains for larger screens */}
          <nav className={`main-nav`} aria-hidden={false}>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#why-us">Why Us</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#contact" className="cta-button-nav">Get a Free Quote</a></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
