import React from 'react';
import { Award, Shield, Users, Star, Clock, CheckCircle } from './icons.jsx';

const Hero = ({ onBookNow }) => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content stack">
          <div className="hero-top">
            <h1 className="hero-title">Your <span className="text-highlight">Trusted</span> Scottsdale Handyman</h1>
            <p className="hero-subtitle">Quality craftsmanship that exceeds expectations</p>
            <p className="hero-description">From quick fixes to complete renovations, we deliver professional results with exceptional customer service.</p>
          </div>

          <div className="hero-actions">
            <button type="button" onClick={onBookNow} className="cta-primary" aria-label="Get a free estimate">Get Free Estimate</button>
            <a href="tel:+14802555887" className="cta-secondary" aria-label="Call now">📞 Call (480) 255-5887</a>
          </div>

          <div className="hero-trust">
            <div className="trust-badge">
              <Award size={18} />
              <div>
                <strong>Top-Rated Pro</strong>
                <small>100+ 5-star reviews</small>
              </div>
            </div>
            <div className="trust-badge">
              <Shield size={18} />
              <div>
                <strong>Licensed & Insured</strong>
                <small>Fully bonded contractor</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
