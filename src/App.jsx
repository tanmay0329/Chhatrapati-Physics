import React, { useState, useEffect } from 'react';
import { PlayCircle, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import StandardTabs from './components/StandardTabs';
import BoardTabs from './components/BoardTabs';

import ResourceSection from './components/ResourceSection';
import Footer from './components/Footer';
import { structure } from './data/structure';
import './App.css';

import resourceData from './resources.json';

function App() {
  const [activeStandardId, setActiveStandardId] = useState(structure[0].id);
  const [activeBoard, setActiveBoard] = useState(structure[0].boards[0]);


  const [resources, setResources] = useState(resourceData);
  const activeStandardData = structure.find(s => s.id === activeStandardId);


  const handleStandardChange = (id) => {
    setActiveStandardId(id);
    const newStandard = structure.find(s => s.id === id);
    if (newStandard && !newStandard.boards.includes(activeBoard)) {
      setActiveBoard(newStandard.boards[0]);
    }
  };

  const [activeCategory, setActiveCategory] = useState(null);
  console.log("rr:", resources);

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('announcements');
    const defaultAnnouncements = [
      { 
        id: 2, 
        text: "The Journey Begins — My YouTube Channel Is Live 🎥", 
        date: new Date().toLocaleDateString(),
        link: "https://www.youtube.com/@chhatrapati.physics"
      },
      { id: 1, text: "New courses for 2025 are now available! Enroll today.", date: new Date().toLocaleDateString() }
    ];

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        // Update existing announcement if found
        const updatedParsed = parsed.map(a => {
          if (a.id === 2) {
            return { ...a, link: "https://www.youtube.com/@chhatrapati.physics" };
          }
          return a;
        });

        const hasNewAnnouncement = updatedParsed.some(a => a.id === 2);
        
        if (!hasNewAnnouncement) {
          return [defaultAnnouncements[0], ...updatedParsed];
        }
        return updatedParsed;
      } catch (e) {
        console.error('Failed to parse announcements from localStorage', e);
      }
    }
    return defaultAnnouncements;
  });

  useEffect(() => {
    localStorage.setItem('announcements', JSON.stringify(announcements));
  }, [announcements]);




  useEffect(() => {
    setActiveCategory(null);
  }, [activeStandardId, activeBoard]);




  const currentResources = resources[activeStandardId]?.[activeBoard] || {};

  const renderContent = () => {
    if (activeCategory === 'video') {
      return (
        <div className="category-content">
          <h3>Video Lectures</h3>
          <ResourceSection 
            type="video" 
            resources={currentResources.video || []}
            standard={activeStandardId}
            board={activeBoard}
          />
        </div>
      );
    }

    if (activeCategory === 'pdf') {
      return (
        <div className="category-content">
          <h3>Study Notes</h3>
          <ResourceSection 
            type="pdf" 
            resources={currentResources.pdf || []}
            standard={activeStandardId}
            board={activeBoard}
          />
        </div>
      );
    }

    return (
      <div className="category-grid">
        <div className="category-card" onClick={() => setActiveCategory('video')}>
          <div className="category-icon">
            <PlayCircle size={48} />
          </div>
          <h3>Video Lectures</h3>
          <p>Watch high-quality video lectures</p>
          <span className="category-action">
            Watch Now <ArrowRight size={16} />
          </span>
        </div>
        <div className="category-card" onClick={() => setActiveCategory('pdf')}>
          <div className="category-icon">
            <BookOpen size={48} />
          </div>
          <h3>Study Notes</h3>
          <p>Read comprehensive study materials</p>
          <span className="category-action">
            Read Now <ArrowRight size={16} />
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <Header 
        announcements={announcements}
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
                Select your board to view resources
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
