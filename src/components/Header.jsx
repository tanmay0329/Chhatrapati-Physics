import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Bell, X, Plus, Edit2, Trash2, Check } from 'lucide-react';

import logo from '../assets/logo_nrjt.png';

const Header = ({ 
  isStudentMode, 
  onToggleMode, 
  announcements = [], 
  onAddAnnouncement, 
  onEditAnnouncement, 
  onDeleteAnnouncement 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAnnouncement, setNewAnnouncement] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const latestAnnouncement = announcements.length > 0 ? announcements[0].text : 'Welcome to EduPlatform!';

  const handleAdd = (e) => {
    e.preventDefault();
    if (newAnnouncement.trim()) {
      onAddAnnouncement(newAnnouncement);
      setNewAnnouncement('');
      setIsModalOpen(false); // Close modal after posting
    }
  };

  const startEdit = (announcement) => {
    setEditingId(announcement.id);
    setEditText(announcement.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      onEditAnnouncement(id, editText);
      setEditingId(null);
    }
  };

  return (
    <>
      <header className="header-container">
        <div className="announcement-bar">
          <Bell size={16} />
          <span>{latestAnnouncement}</span>
        </div>
        <div className="main-header">
          <div className="logo-container">
            <img src={logo} alt="EduPlatform Logo" className="logo-image" />
            <h1 className="logo">EduPlatform</h1>
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

            {!isStudentMode && (
              <form onSubmit={handleAdd} className="add-announcement-form" style={{ marginBottom: '2rem' }}>
                <div className="input-wrapper">
                  <Plus size={20} />
                  <input
                    type="text"
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    placeholder="Post a new announcement..."
                  />
                  <button 
                    type="submit" 
                    className="submit-button" 
                    style={{ width: 'auto', padding: '0.5rem 1rem', marginLeft: '0.5rem' }}
                    disabled={!newAnnouncement.trim()}
                  >
                    Post
                  </button>
                </div>
              </form>
            )}

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
                      {editingId === announcement.id ? (
                        <div className="input-wrapper" style={{ padding: '0.25rem 0.5rem' }}>
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <>
                          <p style={{ color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{announcement.text}</p>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{announcement.date}</span>
                        </>
                      )}
                    </div>

                    {!isStudentMode && (
                      <div className="actions" style={{ display: 'flex', gap: '0.5rem' }}>
                        {editingId === announcement.id ? (
                          <button 
                            onClick={() => saveEdit(announcement.id)}
                            className="edit-icon-btn small"
                            style={{ color: 'var(--primary)' }}
                          >
                            <Check size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => startEdit(announcement)}
                            className="edit-icon-btn small"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => onDeleteAnnouncement(announcement.id)}
                          className="edit-icon-btn small delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
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
