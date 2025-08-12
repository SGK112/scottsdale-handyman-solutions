import React from 'react';

const ServicePackageCard = ({ pkg, onBookNow }) => (
  <div className={`service-card ${pkg.popular ? 'popular' : ''}`}>
    {pkg.popular && <div className="popular-badge">Most Popular</div>}
    
    <div className="service-icon">
      {pkg.icon}
    </div>
    
    <h3 className="service-title">{pkg.name}</h3>
    
    <div className="service-pricing">
      <span className="service-price">{pkg.price}</span>
      {pkg.originalPrice && (
        <span className="service-original-price">{pkg.originalPrice}</span>
      )}
    </div>
    
    <div className="service-duration">{pkg.duration}</div>
    
    <ul className="service-features">
      {pkg.features.map((feature, index) => (
        <li key={index}>{feature}</li>
      ))}
    </ul>
    
    <button onClick={() => onBookNow(pkg)} className="service-btn">
      Book Now
    </button>
  </div>
);

export default ServicePackageCard;
