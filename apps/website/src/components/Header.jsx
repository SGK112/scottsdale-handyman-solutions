import React from 'react';
import { Phone, Mail, MapPin, Clock, Menu, X, Lock } from './icons.jsx';

export default function Header({ onProPortalClick, onWorkWithUsClick }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="header">
      <div className="header-top">
        <div className="container">
          <div className="contact-info">
            <span><Phone size={14} /> (480) 255-5887</span>
            <span><Mail size={14} /> contact@scottsdalehandymansolutions.com</span>
          </div>
          <div className="top-links">
            <a href="#" onClick={(e) => { e.preventDefault(); onWorkWithUsClick(); }}>Work With Us</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onProPortalClick(); }}>Pro Portal</a>
          </div>
        </div>
      </div>
      <div className="header-main">
        <div className="container">
          <a href="/" className="logo">
            <div className="logo-icon">
              <span>🔧</span>
            </div>
            <div className="logo-text">
              <h1>Scottsdale Handyman Solutions</h1>
              <p>Your Trusted Partner for Home Repairs & Maintenance</p>
            </div>
          </a>
          <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#why-us">Why Us</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#contact" className="cta-button-nav">Get a Free Quote</a></li>
            </ul>
          </nav>
          <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
