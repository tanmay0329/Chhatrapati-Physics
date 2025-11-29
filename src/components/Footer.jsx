import React from 'react';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>EduPlatform</h3>
          <p>Empowering students to achieve their academic goals with top-quality resources and guidance.</p>
        </div>
        
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Courses</a></li>
            <li><a href="#">Success Stories</a></li>
            <li><a href="#">Terms of Service</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact Us</h3>
          <div className="contact-item">
            <Mail size={16} />
            <span>support@eduplatform.com</span>
          </div>
          <div className="contact-item">
            <Phone size={16} />
            <span>+91 98765 43210</span>
          </div>
          <div className="contact-item">
            <MapPin size={16} />
            <span>123 Education Lane, Knowledge City</span>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#" className="social-icon"><Facebook size={20} /></a>
            <a href="#" className="social-icon"><Twitter size={20} /></a>
            <a href="#" className="social-icon"><Instagram size={20} /></a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 EduPlatform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
