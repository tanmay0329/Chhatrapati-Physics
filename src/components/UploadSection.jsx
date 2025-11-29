import React, { useState } from 'react';
import { Upload, FileText, Video, FolderPlus, X, Link as LinkIcon } from 'lucide-react';

const UploadSection = ({ type, onUpload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [referenceLink, setReferenceLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const isVideo = type === 'video';
  const icon = isVideo ? <Video size={48} /> : <FileText size={48} />;
  const label = isVideo ? 'Upload Video' : 'Upload PDF';
  const subLabel = isVideo ? 'Drag & drop video files here' : 'Drag & drop PDF files here';

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setIsModalOpen(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (folderName) {
      // Create a file object with necessary details only if a file is selected
      let fileData = null;
      
      if (selectedFile) {
        fileData = {
          name: selectedFile.name,
          size: (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB',
          date: new Date().toLocaleDateString(),
          type: type,
          link: referenceLink // Pass link with file if file exists
        };
      } else {
        // If no file, we might still want to pass the link to associate with the folder
        // We'll pass a "dummy" file object or handle it in App.jsx
        // Actually, let's pass the link as a separate property or attached to a dummy object
        // The App.jsx expects (folderName, file, type). 
        // We can pass file as { link: referenceLink } if no actual file.
        fileData = { link: referenceLink };
      }
      
      onUpload(folderName, fileData);
      
      // Reset state
      setFolderName('');
      setReferenceLink('');
      setSelectedFile(null);
      setIsModalOpen(false);
    }
  };

  const openCreateFolderModal = () => {
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="upload-card">
        <div className="upload-icon-wrapper">
          {icon}
        </div>
        <h3>{label}</h3>
        <p>{subLabel}</p>
        <div className="upload-button-wrapper">
          <input 
            type="file" 
            id={`file-upload-${type}`}
            className="hidden-input"
            onChange={handleFileSelect}
            accept={isVideo ? "video/*" : ".pdf"}
            style={{ display: 'none' }}
          />
          <div className="action-buttons" style={{ display: 'flex', gap: '1rem' }}>
            <label htmlFor={`file-upload-${type}`} className="upload-button">
              <Upload size={16} />
              <span>Select File</span>
            </label>
            <button 
              type="button" 
              className="upload-button" 
              onClick={openCreateFolderModal}
              style={{ background: 'var(--surface)', color: 'var(--primary)', border: '1px solid var(--primary)' }}
            >
              <FolderPlus size={16} />
              <span>Create Folder</span>
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{selectedFile ? 'Upload to Folder' : 'Create New Folder'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="close-button">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Folder Name (e.g., Chapter 1)</label>
                <div className="input-wrapper">
                  <FolderPlus size={20} />
                  <input
                    type="text"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
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
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>

              {selectedFile && (
                <div className="file-preview">
                  <p>Selected File: <strong>{selectedFile.name}</strong></p>
                </div>
              )}
              
              <button type="submit" className="submit-button">
                {selectedFile ? 'Upload to Folder' : 'Create Folder'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadSection;
