import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Github, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>NRJT - EduPlatform</h3>
          <p>Making you understand, not memorize — not teaching physics, but unlocking it.</p>
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
            <span>tanmay.bora221@vit.edu</span>
          </div>
          <div className="contact-item">
            <Phone size={16} />
            <span>+91 90961 96576</span>
          </div>
          <div className="contact-item">
            <MapPin size={16} />
            <span>Pune, Maharashtra, India</span>
          </div>
        </div>
        
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.instagram.com/justdude_001?igsh=bHU1NW83eHMybDRp" className="social-icon" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
            <a href="https://www.linkedin.com/in/tanmay-bora/" className="social-icon" target="_blank" rel="noopener noreferrer"><Linkedin size={20} /></a>
            <a href="https://www.youtube.com/@physicsbynikyya" className="social-icon" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
            <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
            <a href="#" className="social-icon" target="_blank" rel="noopener noreferrer"><Twitter size={20} /></a>
            <a href="https://github.com/tanmay0329" className="social-icon" target="_blank" rel="noopener noreferrer"><Github size={20} /></a>
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
