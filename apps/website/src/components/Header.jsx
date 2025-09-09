import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Menu, X, Lock, ExternalLink } from './icons.jsx';

export default function Header({ onProPortalClick, onWorkWithUsClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleProPortalClick = () => {
    const proPortalUrl = import.meta.env.VITE_PRO_PORTAL_URL || 'http://localhost:5177';
    window.open(proPortalUrl, '_blank');
  };

  const handleGetQuote = () => {
    if (onWorkWithUsClick) {
      onWorkWithUsClick();
    } else {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="new-header">
      <div className="new-header-container">
        {/* Logo */}
        <div className="new-logo">
          <div className="new-logo-icon">🔧</div>
          <div className="new-logo-text">
            <span className="new-logo-main">Scottsdale</span>
            <span className="new-logo-accent">Handyman</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="new-nav-desktop">
          <a href="#services" className="new-nav-link">Services</a>
          <a href="#why-us" className="new-nav-link">About</a>
          <a href="#testimonials" className="new-nav-link">Reviews</a>
          <a href="tel:+14802555887" className="new-nav-btn call-btn">
            <Phone size={18} />
            Call
          </a>
          <button onClick={handleGetQuote} className="new-nav-btn quote-btn">
            <Mail size={18} />
            Get Quote
          </button>
          <button onClick={handleProPortalClick} className="new-nav-btn pro-btn">
            <Lock size={16} />
            Pro
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="new-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="new-mobile-overlay">
            <div className="new-mobile-menu">
              <div className="new-mobile-header">
                <span>Menu</span>
                <button onClick={toggleMobileMenu}>
                  <X size={24} />
                </button>
              </div>
              
              <div className="new-mobile-actions">
                <a href="tel:+14802555887" className="new-mobile-action call">
                  <Phone size={20} />
                  <div>
                    <span>Call Now</span>
                    <small>(480) 255-5887</small>
                  </div>
                </a>
                
                <button onClick={() => { handleGetQuote(); setMobileMenuOpen(false); }} className="new-mobile-action quote">
                  <Mail size={20} />
                  <div>
                    <span>Get Free Quote</span>
                    <small>Fast response</small>
                  </div>
                </button>
              </div>

              <div className="new-mobile-links">
                <a href="#services" onClick={toggleMobileMenu}>Services</a>
                <a href="#why-us" onClick={toggleMobileMenu}>About Us</a>
                <a href="#testimonials" onClick={toggleMobileMenu}>Reviews</a>
                <button onClick={() => { handleProPortalClick(); setMobileMenuOpen(false); }} className="new-mobile-pro">
                  <Lock size={16} />
                  Professional Portal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
