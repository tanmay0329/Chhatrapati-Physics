import React, { useState } from 'react';
import { PlayCircle, BookOpen, Folder, ChevronDown, ChevronRight, File, Link as LinkIcon } from 'lucide-react';

const ResourceSection = ({ type, resources = [] }) => {
  const [expandedFolders, setExpandedFolders] = useState({});


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

  const handleFileClick = (file, folderName) => {
    
    if (file.link) {
      window.open(file.link, '_blank');
      return;
    }
    
    const filePath = `/NRJT-EDU-PLATFROM/9th/CBSE/${folderName}/${file.name}`;
    window.open(filePath, '_blank');
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
            <div 
              className="folder-header"
              onClick={() => toggleFolder(folder.folderName)}
            >
              <div 
                className="folder-toggle-icon"
              >
                {expandedFolders[folder.folderName] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </div>
              
              <div className="folder-info">
                <Folder size={20} className="folder-icon" />
                <span className="folder-name">
                  {folder.folderName}
                </span>
                <span className="file-count">({folder.files.length} files)</span>
              </div>

              {folder.link && (
                <button 
                  className="link-icon-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFolderClick(folder);
                  }}
                  title="Open reference link"
                >
                  <LinkIcon size={16} />
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
                      
                        <button 
                          className="action-btn"
                          onClick={() => handleFileClick(file, folder.folderName)}
                        >
                          {isVideo ? 'Watch' : 'Read'}
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default ResourceSection;
