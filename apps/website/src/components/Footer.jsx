import React from 'react';
import { Phone, Mail, MapPin } from './icons.jsx';

const Footer = ({ onProPortalClick, onWorkWithUsClick }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-column">
            <h4>Scottsdale Handyman Solutions</h4>
            <p>Your trusted partner for all home repair and maintenance needs. Quality service, guaranteed.</p>
          </div>
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#services">Services</a></li>
              <li><a href="#why-us">Why Us</a></li>
              <li><a href="#testimonials">Testimonials</a></li>
              <li><a href="#blog">Blog</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>For Professionals</h4>
            <ul>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onProPortalClick(); }}>Pro Portal</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); onWorkWithUsClick(); }}>Work With Us</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Contact Us</h4>
            <p><Phone size={14} /> (480) 255-5887</p>
            <p><Mail size={14} /> contact@scottsdalehandymansolutions.com</p>
            <p><MapPin size={14} /> Scottsdale, AZ</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Scottsdale Handyman Solutions LLC. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
