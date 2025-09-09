import React from 'react';

const CtaSection = ({ onBookNow }) => {
  return (
    <section id="contact" className="cta-section">
      <div className="container">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Your home deserves the best. Contact us today for a free, no-obligation estimate and let's get your project done right.</p>
          <div className="cta-buttons">
            <button type="button" onClick={onBookNow} className="cta-btn-primary cta-button-nav">Book Your Free Estimate Now</button>
            <a href="tel:+14802555887" className="cta-btn-secondary">Call Now: (480) 255-5887</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
