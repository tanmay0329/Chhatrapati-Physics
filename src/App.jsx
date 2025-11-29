import React, { useState, useEffect } from 'react';
import { PlayCircle, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import StandardTabs from './components/StandardTabs';
import BoardTabs from './components/BoardTabs';
import UploadSection from './components/UploadSection';
import ResourceSection from './components/ResourceSection';
import Footer from './components/Footer';
import { structure } from './data/structure';
import './App.css';

function App() {
  const [activeStandardId, setActiveStandardId] = useState(structure[0].id);
  const [activeBoard, setActiveBoard] = useState(structure[0].boards[0]);
  const [isStudentMode, setIsStudentMode] = useState(false);
  
  // State for storing resources
  // Structure: { [standardId]: { [board]: { [type]: [{ folderName, files: [] }] } } }
  const [resources, setResources] = useState({});

  const activeStandardData = structure.find(s => s.id === activeStandardId);

  // Reset board when standard changes if the current board is not available in the new standard
  // Although currently all standards have same boards, this is good for future proofing
  const handleStandardChange = (id) => {
    setActiveStandardId(id);
    const newStandard = structure.find(s => s.id === id);
    if (newStandard && !newStandard.boards.includes(activeBoard)) {
      setActiveBoard(newStandard.boards[0]);
    }
  };

  const [activeCategory, setActiveCategory] = useState(null); // 'video' | 'pdf' | null
  
  // Announcements State - Load from localStorage on mount
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('announcements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse announcements from localStorage', e);
      }
    }
    return [
      { id: 1, text: "New courses for 2025 are now available! Enroll today.", date: new Date().toLocaleDateString() }
    ];
  });

  // Save announcements to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  }, [announcements]);

  const handleAddAnnouncement = (text) => {
    const newAnnouncement = {
      id: Date.now(),
      text,
      date: new Date().toLocaleDateString()
    };
    setAnnouncements([newAnnouncement, ...announcements]);
  };

  const handleEditAnnouncement = (id, newText) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, text: newText } : a
    ));
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter(a => a.id !== id));
  };

  // Reset category when switching modes or standards
  useEffect(() => {
    setActiveCategory(null);
  }, [isStudentMode, activeStandardId, activeBoard]);

  const handleUpload = (folderName, fileData, type) => {
    setResources(prev => {
      const standardResources = prev[activeStandardId] || {};
      const boardResources = standardResources[activeBoard] || {};
      const typeResources = boardResources[type] || [];

      const existingFolderIndex = typeResources.findIndex(f => f.folderName === folderName);
      let newTypeResources;
      
      // Extract link from fileData if present
      const link = fileData?.link;
      
      // Check if it's a real file upload or just folder creation
      const isRealFile = fileData && fileData.name;

      if (existingFolderIndex >= 0) {
        newTypeResources = [...typeResources];
        
        const updatedFolder = { ...newTypeResources[existingFolderIndex] };
        
        // Add file only if it's a real file
        if (isRealFile) {
          updatedFolder.files = [...updatedFolder.files, fileData];
        }
        
        // Update link if provided
        if (link) {
          updatedFolder.link = link;
        }
        
        newTypeResources[existingFolderIndex] = updatedFolder;
      } else {
        newTypeResources = [
          ...typeResources,
          { 
            folderName, 
            files: isRealFile ? [fileData] : [], 
            link: link 
          }
        ];
      }

      return {
        ...prev,
        [activeStandardId]: {
          ...standardResources,
          [activeBoard]: {
            ...boardResources,
            [type]: newTypeResources
          }
        }
      };
    });
  };

  const handleEditFolder = (oldFolderName, newFolderName, newLink, type) => {
    setResources(prev => {
      const standardResources = prev[activeStandardId] || {};
      const boardResources = standardResources[activeBoard] || {};
      const typeResources = boardResources[type] || [];

      const updatedTypeResources = typeResources.map(folder => {
        if (folder.folderName === oldFolderName) {
          return { ...folder, folderName: newFolderName, link: newLink };
        }
        return folder;
      });

      return {
        ...prev,
        [activeStandardId]: {
          ...standardResources,
          [activeBoard]: {
            ...boardResources,
            [type]: updatedTypeResources
          }
        }
      };
    });
  };

  const handleRenameFile = (folderName, oldFileName, newFileName, type) => {
    setResources(prev => {
      const standardResources = prev[activeStandardId] || {};
      const boardResources = standardResources[activeBoard] || {};
      const typeResources = boardResources[type] || [];

      const updatedTypeResources = typeResources.map(folder => {
        if (folder.folderName === folderName) {
          const updatedFiles = folder.files.map(file => {
            if (file.name === oldFileName) {
              return { ...file, name: newFileName };
            }
            return file;
          });
          return { ...folder, files: updatedFiles };
        }
        return folder;
      });

      return {
        ...prev,
        [activeStandardId]: {
          ...standardResources,
          [activeBoard]: {
            ...boardResources,
            [type]: updatedTypeResources
          }
        }
      };
    });
  };

  const handleDeleteFile = (folderName, fileName, type) => {
    setResources(prev => {
      const standardResources = prev[activeStandardId] || {};
      const boardResources = standardResources[activeBoard] || {};
      const typeResources = boardResources[type] || [];

      const updatedTypeResources = typeResources.map(folder => {
        if (folder.folderName === folderName) {
          const updatedFiles = folder.files.filter(file => file.name !== fileName);
          return { ...folder, files: updatedFiles };
        }
        return folder;
      });

      return {
        ...prev,
        [activeStandardId]: {
          ...standardResources,
          [activeBoard]: {
            ...boardResources,
            [type]: updatedTypeResources
          }
        }
      };
    });
  };

  // Get current resources for display
  const currentResources = resources[activeStandardId]?.[activeBoard] || {};

  const renderContent = () => {
    // Video Category
    if (activeCategory === 'video') {
      return (
        <div className="category-content">
          <h3>{isStudentMode ? 'Video Lectures' : 'Manage Videos'}</h3>
          
          {!isStudentMode && (
            <UploadSection 
              type="video" 
              onUpload={(folder, file) => handleUpload(folder, file, 'video')}
            />
          )}
          
          <ResourceSection 
            type="video" 
            resources={currentResources.video || []}
            isAdmin={!isStudentMode}
            onEdit={!isStudentMode ? (oldName, newName, link) => handleEditFolder(oldName, newName, link, 'video') : undefined}
            onRenameFile={!isStudentMode ? (folder, oldName, newName) => handleRenameFile(folder, oldName, newName, 'video') : undefined}
            onDeleteFile={!isStudentMode ? (folder, fileName) => handleDeleteFile(folder, fileName, 'video') : undefined}
          />
        </div>
      );
    }

    // PDF Category
    if (activeCategory === 'pdf') {
      return (
        <div className="category-content">
          <h3>{isStudentMode ? 'Study Notes' : 'Manage PDFs'}</h3>
          
          {!isStudentMode && (
            <UploadSection 
              type="pdf" 
              onUpload={(folder, file) => handleUpload(folder, file, 'pdf')}
            />
          )}

          <ResourceSection 
            type="pdf" 
            resources={currentResources.pdf || []}
            isAdmin={!isStudentMode}
            onEdit={!isStudentMode ? (oldName, newName, link) => handleEditFolder(oldName, newName, link, 'pdf') : undefined}
            onRenameFile={!isStudentMode ? (folder, oldName, newName) => handleRenameFile(folder, oldName, newName, 'pdf') : undefined}
            onDeleteFile={!isStudentMode ? (folder, fileName) => handleDeleteFile(folder, fileName, 'pdf') : undefined}
          />
        </div>
      );
    }

    // Category Selection (Cards)
    return (
      <div className="category-grid">
        <div className="category-card" onClick={() => setActiveCategory('video')}>
          <div className="category-icon">
            <PlayCircle size={48} />
          </div>
          <h3>{isStudentMode ? 'Video Lectures' : 'Manage Videos'}</h3>
          <p>{isStudentMode ? 'Watch high-quality video lectures' : 'Upload and manage video content'}</p>
          <span className="category-action">
            {isStudentMode ? 'Watch Now' : 'Manage'} <ArrowRight size={16} />
          </span>
        </div>
        <div className="category-card" onClick={() => setActiveCategory('pdf')}>
          <div className="category-icon">
            <BookOpen size={48} />
          </div>
          <h3>{isStudentMode ? 'Study Notes' : 'Manage PDFs'}</h3>
          <p>{isStudentMode ? 'Read comprehensive study materials' : 'Upload and manage PDF notes'}</p>
          <span className="category-action">
            {isStudentMode ? 'Read Now' : 'Manage'} <ArrowRight size={16} />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Header 
        isStudentMode={isStudentMode} 
        onToggleMode={() => setIsStudentMode(!isStudentMode)}
        announcements={announcements}
        onAddAnnouncement={handleAddAnnouncement}
        onEditAnnouncement={handleEditAnnouncement}
        onDeleteAnnouncement={handleDeleteAnnouncement}
      />
      
      <main className="main-content">
        <StandardTabs 
          standards={structure} 
          activeStandard={activeStandardId} 
          onSelect={handleStandardChange} 
        />

        <div className="content-area">
          <div className="section-header">
            <h2>{activeStandardData?.label}</h2>
            {activeStandardData?.boards.length > 0 && (
              <p>
                {isStudentMode 
                  ? 'Select your board to view resources' 
                  : 'Select your board to manage content'}
              </p>
            )}
          </div>

          {activeStandardData?.boards.length > 0 && (
            <BoardTabs 
              boards={activeStandardData.boards} 
              activeBoard={activeBoard} 
              onSelect={setActiveBoard} 
            />
          )}

          {activeCategory && (
            <button className="back-button" onClick={() => setActiveCategory(null)}>
              <ArrowLeft size={20} />
              <span>Back to Categories</span>
            </button>
          )}

          {renderContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;
