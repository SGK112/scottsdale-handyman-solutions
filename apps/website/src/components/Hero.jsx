import React from 'react';
import { Award, Shield, Users, Star, Clock, CheckCircle } from './icons.jsx';

const Hero = ({ onBookNow }) => {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <div className="hero-badges">
            <span className="hero-badge">⭐ 5-Star Rated</span>
            <span className="hero-badge">🛡️ Licensed & Insured</span>
          </div>
          
          <h1 className="hero-title">
            Your <span className="text-highlight">Trusted</span> Scottsdale Handyman
          </h1>
          <h2 className="hero-subtitle">Quality craftsmanship that exceeds expectations</h2>
          
          <p className="hero-description">
            From quick fixes to complete renovations, we deliver professional results with exceptional customer service. Get your project done right the first time.
          </p>
          
          <div className="hero-value-props">
            <div className="value-prop">
              <CheckCircle size={16} />
              <span>Same-day service available</span>
            </div>
            <div className="value-prop">
              <CheckCircle size={16} />
              <span>Free detailed estimates</span>
            </div>
            <div className="value-prop">
              <CheckCircle size={16} />
              <span>100% satisfaction guaranteed</span>
            </div>
          </div>
          
          <div className="cta-buttons">
            <button onClick={onBookNow} className="cta-primary">
              <span>Get Free Estimate</span>
              <small>Usually responds within 1 hour</small>
            </button>
            <a href="tel:+14802555887" className="cta-secondary">
              <span>📞 Call Now</span>
              <strong>(480) 255-5887</strong>
            </a>
          </div>
          
          <div className="trust-indicators">
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
            <div className="trust-badge">
              <Users size={18} />
              <div>
                <strong>10+ Years Experience</strong>
                <small>Serving Scottsdale area</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
