import React, { useState } from 'react';
import { X } from './icons.jsx';
import GoogleMapsIntegration from './GoogleMapsIntegration';
import { submitLead, BUSINESS_PHONE, BUSINESS_PHONE_HREF } from '../leadCapture';

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
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const isEmergency = selectedPackage?.name === 'Emergency Service';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setErrorMessage('');

    try {
      await submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        message: formData.message,
        service: selectedPackage?.name || 'General inquiry',
        urgency: isEmergency ? 'emergency' : 'normal',
        package_price: selectedPackage?.price || '',
        service_area: serviceAreaStatus?.inServiceArea === false ? 'outside' : 'in-area',
        validated_address: addressValidation?.formattedAddress || formData.address,
      });
      setStatus('sent');
    } catch (error) {
      // Never tell someone we received a request we did not receive — show the
      // failure and the phone number so the lead has a way through.
      console.error('Booking submission failed:', error);
      setErrorMessage(error.message || 'Something went wrong');
      setStatus('error');
    }
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
          {status === 'sent' ? (
            <div style={{ textAlign: 'center', padding: '1rem 0' }}>
              <div style={{ fontSize: '3rem', lineHeight: 1 }}>✅</div>
              <h3 style={{ margin: '1rem 0 0.5rem' }}>Request received</h3>
              <p style={{ color: '#4b5563', margin: 0 }}>
                {isEmergency
                  ? 'This came in as an emergency — we respond 24/7 and will call you right away.'
                  : "We've got your details and will be in touch shortly to confirm your appointment."}
              </p>
              <p style={{ color: '#4b5563', marginTop: '1rem' }}>
                Need us sooner? Call{' '}
                <a href={BUSINESS_PHONE_HREF} style={{ fontWeight: 700 }}>{BUSINESS_PHONE}</a>.
              </p>
              <div className="modal-footer" style={{ justifyContent: 'center' }}>
                <button type="button" onClick={onClose} className="btn-primary">Done</button>
              </div>
            </div>
          ) : (
          <>
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
            
            {status === 'error' && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b',
                borderRadius: '8px', padding: '0.75rem 1rem', margin: '0 0 1rem'
              }}>
                <strong>We couldn't send that request.</strong>
                <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  {errorMessage}. Please call{' '}
                  <a href={BUSINESS_PHONE_HREF} style={{ color: '#991b1b', fontWeight: 700 }}>
                    {BUSINESS_PHONE}
                  </a>{' '}
                  and we'll take care of you directly.
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : status === 'error' ? 'Try Again' : 'Submit Request'}
              </button>
            </div>
          </form>
          </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
