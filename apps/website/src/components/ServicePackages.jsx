import React from 'react';
import ServicePackageCard from './ServicePackageCard';
import { servicePackages } from '../data';

const ServicePackages = ({ onBookNow }) => {
  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Our Service Packages</h2>
          <p className="section-description">Choose the perfect package for your needs. All our work is backed by a 100% satisfaction guarantee.</p>
        </div>
        <div className="services-grid">
          {servicePackages.map((pkg, index) => (
            <ServicePackageCard key={index} pkg={pkg} onBookNow={onBookNow} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicePackages;
