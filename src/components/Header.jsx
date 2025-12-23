import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Bell, X } from 'lucide-react';

import logo from '../assets/Nikhil Physics.png';

const Header = ({ announcements = [] }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const latestAnnouncement = announcements.length > 0 ? announcements[0] : { text: 'Welcome to EduPlatform!' };

  return (
    <>
      <header className="header-container">
        <div className="announcement-bar">
          <Bell size={16} />
          {latestAnnouncement.link ? (
            <a 
              href={latestAnnouncement.link} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <span>🔗 {latestAnnouncement.text}</span>
            </a>
          ) : (
            <span>{latestAnnouncement.text}</span>
          )}
        </div>
        <div className="main-header">
          <div className="logo-container">
            <img src={logo} alt="Nikhil Physics Logo" className="logo-image" />
            <h1 className="logo">Nikhil Physics</h1>
          </div>
          
          <div className="header-actions">   
            <button className="announcements-btn" onClick={() => setIsModalOpen(true)}>
              <Bell size={18} />
              Announcements
            </button>
          </div>
        </div>
      </header>

      {isModalOpen && ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>Announcements</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-button">
                <X size={20} />
              </button>
            </div>

            <div className="announcements-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
              {announcements.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No announcements yet.</p>
              ) : (
                announcements.map((announcement) => (
                  <div 
                    key={announcement.id} 
                    className="announcement-item"
                    style={{ 
                      padding: '1rem', 
                      backgroundColor: 'var(--background)', 
                      borderRadius: '0.5rem',
                      border: '1px solid var(--border)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}
                  >
                      <div style={{ flex: 1 }}>
                        <>
                          <p style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{announcement.text}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{announcement.date}</span>
                        </>
                      </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Header;
