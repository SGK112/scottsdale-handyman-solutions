import React, { useState } from 'react';
import { X } from './icons.jsx';
import { submitLead, BUSINESS_PHONE, BUSINESS_PHONE_HREF } from '../leadCapture';

const WorkWithUsModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    message: ''
  });

  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
        service: 'Contractor application',
        message: `Experience: ${formData.experience}\nSkills: ${formData.skills}\n\n${formData.message}`,
        source: 'scottsdalehandyman.com/work-with-us', // carried as `origin`
      });
      setStatus('sent');
    } catch (error) {
      console.error('Application submission failed:', error);
      setErrorMessage(error.message || 'Something went wrong');
      setStatus('error');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Join Our Team</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <p style={{ marginBottom: '1.5rem', color: 'var(--gray-600)' }}>
            We're looking for skilled and reliable professionals to join our growing team. 
            Fill out the form below to apply for opportunities with Scottsdale Handyman Solutions.
          </p>
          
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
              <label className="form-label">Years of Experience *</label>
              <select
                name="experience"
                className="form-input form-select"
                value={formData.experience}
                onChange={handleInputChange}
                required
              >
                <option value="">Select experience level</option>
                <option value="1-2">1-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Specialties/Skills</label>
              <input
                type="text"
                name="skills"
                className="form-input"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="e.g., Plumbing, Electrical, Carpentry, Painting..."
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Why do you want to work with us?</label>
              <textarea
                name="message"
                className="form-input form-textarea"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Tell us about your experience and why you'd be a great addition to our team..."
              />
            </div>
            
            {status === 'sent' && (
              <div style={{
                background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534',
                borderRadius: '8px', padding: '0.75rem 1rem', margin: '0 0 1rem'
              }}>
                <strong>Application received.</strong> We'll review it and get back to you.
              </div>
            )}

            {status === 'error' && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b',
                borderRadius: '8px', padding: '0.75rem 1rem', margin: '0 0 1rem'
              }}>
                <strong>We couldn't send that application.</strong>
                <div style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>
                  {errorMessage}. Please call{' '}
                  <a href={BUSINESS_PHONE_HREF} style={{ color: '#991b1b', fontWeight: 700 }}>
                    {BUSINESS_PHONE}
                  </a>.
                </div>
              </div>
            )}

            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                {status === 'sent' ? 'Close' : 'Cancel'}
              </button>
              <button type="submit" className="btn-primary" disabled={status === 'sending' || status === 'sent'}>
                {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent' : status === 'error' ? 'Try Again' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUsModal;
