import React, { useState } from 'react';
import { X } from './icons.jsx';
import GoogleMapsIntegration from './GoogleMapsIntegration';

const BookingModal = ({ isOpen, onClose, selectedPackage, stripePromise }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  });

  const [addressValidation, setAddressValidation] = useState(null);
  const [serviceAreaStatus, setServiceAreaStatus] = useState(null);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Include address validation and service area information in submission
    const submissionData = {
      ...formData,
      selectedPackage,
      addressValidation,
      serviceAreaStatus
    };
    
    console.log('Booking submitted:', submissionData);
    alert('Thank you for your booking request! We will contact you soon.');
    onClose();
  };

  const handleAddressValidated = (validation) => {
    setAddressValidation(validation);
  };

  const handleServiceAreaVerified = (status) => {
    setServiceAreaStatus(status);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Book Your Service</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          {selectedPackage && (
            <div className="selected-package">
              <h3>{selectedPackage.name}</h3>
              <p className="package-price">{selectedPackage.price}</p>
              <ul>
                {selectedPackage.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Address *</label>
              <input
                type="text"
                name="address"
                className="form-input"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
              <GoogleMapsIntegration 
                address={formData.address}
                onAddressValidated={handleAddressValidated}
                onServiceAreaVerified={handleServiceAreaVerified}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Project Details</label>
              <textarea
                name="message"
                className="form-input form-textarea"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Please describe your project or any specific requirements..."
              />
            </div>
            
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
