import React, { useState } from 'react';
import { PlayCircle, BookOpen, ArrowRight, Folder, ChevronDown, ChevronRight, File, Pencil, X, Link as LinkIcon, FolderPlus, Trash2, Video, FileText } from 'lucide-react';

const ResourceSection = ({ type, resources = [], isAdmin = false, onEdit, onRenameFile, onDeleteFile }) => {
  const [expandedFolders, setExpandedFolders] = useState({});
  const [editingFolder, setEditingFolder] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');
  const [editLink, setEditLink] = useState('');

  // File editing state
  const [editingFile, setEditingFile] = useState(null);
  const [editFileName, setEditFileName] = useState('');
  const [activeFolderForFileEdit, setActiveFolderForFileEdit] = useState('');

  const isVideo = type === 'video';
  const icon = isVideo ? <PlayCircle size={48} /> : <BookOpen size={48} />;
  const label = isVideo ? 'Watch Lectures' : 'Study Notes';

  const toggleFolder = (folderName) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  const handleFolderClick = (folder) => {
    if (folder.link) {
      window.open(folder.link, '_blank');
    }
  };

  const startEdit = (folder, e) => {
    e.stopPropagation();
    setEditingFolder(folder);
    setEditFolderName(folder.folderName);
    setEditLink(folder.link || '');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (editFolderName && editingFolder) {
      onEdit(editingFolder.folderName, editFolderName, editLink);
      setEditingFolder(null);
    }
  };

  const startFileEdit = (folderName, file) => {
    setEditingFile(file);
    setEditFileName(file.name);
    setActiveFolderForFileEdit(folderName);
  };

  const handleFileRenameSubmit = (e) => {
    e.preventDefault();
    if (editFileName && editingFile && activeFolderForFileEdit) {
      onRenameFile(activeFolderForFileEdit, editingFile.name, editFileName);
      setEditingFile(null);
      setActiveFolderForFileEdit('');
    }
  };

  const handleDeleteFileClick = (folderName, fileName) => {
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      onDeleteFile(folderName, fileName);
    }
  };

  if (resources.length === 0) {
    return (
      <div className="resource-card empty-state">
        <div className="resource-icon-wrapper">
          {icon}
        </div>
        <h3>{label}</h3>
        <p>No content uploaded yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="resource-list-container">
        {resources.map((folder, index) => (
          <div key={index} className="folder-item">
            <div className="folder-header">
              <div 
                className="folder-toggle-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFolder(folder.folderName);
                }}
              >
                {expandedFolders[folder.folderName] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
              
              <div 
                className={`folder-info ${folder.link ? 'has-link' : ''}`}
                onClick={() => handleFolderClick(folder)}
              >
                <Folder size={20} className="folder-icon" />
                <span className="folder-name">
                  {folder.folderName}
                  {folder.link && <span className="link-indicator" title="Click to open link">🔗</span>}
                </span>
                <span className="file-count">({folder.files.length} files)</span>
              </div>

              {isAdmin && (
                <button 
                  className="edit-icon-btn"
                  onClick={(e) => startEdit(folder, e)}
                  title="Edit Folder"
                >
                  <Pencil size={16} />
                </button>
              )}
            </div>
            
            {expandedFolders[folder.folderName] && (
              <div className="file-list">
                {folder.files.map((file, fileIndex) => (
                  <div key={fileIndex} className="file-item">
                    <div className="file-info">
                      {isVideo ? <PlayCircle size={16} /> : <File size={16} />}
                      <span className="file-name">{file.name}</span>
                    </div>
                    <div className="file-meta">
                      <span className="file-size">{file.size}</span>
                      <span className="file-date">{file.date}</span>
                      
                      {isAdmin ? (
                        <div className="file-actions">
                          <button 
                            className="edit-icon-btn small"
                            onClick={() => startFileEdit(folder.folderName, file)}
                            title="Rename File"
                          >
                            <Pencil size={14} />
                          </button>
                          <button 
                            className="edit-icon-btn small delete"
                            onClick={() => handleDeleteFileClick(folder.folderName, file.name)}
                            title="Delete File"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ) : (
                        <button className="action-btn">
                          {isVideo ? 'Watch' : 'Read'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Folder Edit Modal */}
      {editingFolder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Edit Folder</h3>
              <button onClick={() => setEditingFolder(null)} className="close-button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Folder Name</label>
                <div className="input-wrapper">
                  <FolderPlus size={20} />
                  <input
                    type="text"
                    value={editFolderName}
                    onChange={(e) => setEditFolderName(e.target.value)}
                    placeholder="Enter folder name..."
                    autoFocus
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Reference Link (Optional)</label>
                <div className="input-wrapper">
                  <LinkIcon size={20} />
                  <input
                    type="url"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              <button type="submit" className="submit-button">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* File Rename Modal */}
      {editingFile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Rename File</h3>
              <button onClick={() => setEditingFile(null)} className="close-button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleFileRenameSubmit}>
              <div className="form-group">
                <label>File Name</label>
                <div className="input-wrapper">
                  {isVideo ? <Video size={20} /> : <FileText size={20} />}
                  <input
                    type="text"
                    value={editFileName}
                    onChange={(e) => setEditFileName(e.target.value)}
                    placeholder="Enter file name..."
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button type="submit" className="submit-button">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ResourceSection;
