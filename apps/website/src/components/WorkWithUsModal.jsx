import React, { useState } from 'react';
import { X } from './icons.jsx';

const WorkWithUsModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    skills: '',
    message: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Handle application submission
    console.log("Application submitted:", formData);
    alert('Thank you for your application! We will review it and get back to you soon.');
    onClose();
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
            
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUsModal;
