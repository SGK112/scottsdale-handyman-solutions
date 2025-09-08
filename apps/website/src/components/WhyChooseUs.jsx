import React from 'react';
import { CheckCircle } from './icons.jsx';

const WhyChooseUs = () => {
  const reasons = [
    "Experienced & Vetted Professionals",
    "Transparent, Upfront Pricing",
    "100% Satisfaction Guarantee",
    "Licensed, Bonded & Insured",
    "Punctual & Reliable Service",
    "Clean & Tidy Workmanship"
  ];

  return (
    <section id="why-us" className="why-choose-us">
      <div className="container">
        <div className="why-choose-us-content">
          <h2>Why Choose Scottsdale Handyman Solutions?</h2>
          <p>We're not just another handyman service. We are your partners in maintaining and improving your home. We are committed to providing a seamless and stress-free experience from start to finish.</p>
          <ul className="reasons-list">
            {reasons.map((reason, index) => (
              <li key={index}><CheckCircle size={20} /> {reason}</li>
            ))}
          </ul>
        </div>
        <div className="why-choose-us-image">
          <img src="/team.svg" alt="Our professional handyman team" loading="lazy" width="500" height="400" />
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
