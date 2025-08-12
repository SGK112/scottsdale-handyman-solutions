import React, { useState } from 'react';
import { X } from './icons.jsx';

const ProPortalModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
    // TODO: Handle pro portal login
    console.log("Pro login submitted:", formData);
    
    // For demo purposes, redirect to pro portal
    window.open('http://localhost:5174', '_blank');
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Professional Portal Access</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="modal-body">
          <p style={{ marginBottom: '1.5rem', color: 'var(--gray-600)' }}>
            Access your professional dashboard to manage leads, projects, and business analytics.
          </p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="modal-footer">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Access Portal
              </button>
            </div>
          </form>
          
          <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--gray-500)' }}>
            Don't have access? <a href="#" style={{ color: 'var(--brand-primary)' }}>Contact us</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProPortalModal;
