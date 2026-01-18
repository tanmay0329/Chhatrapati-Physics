import React, { useState, useEffect } from 'react';
import { PlayCircle, BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from './components/Header';
import StandardTabs from './components/StandardTabs';
import BoardTabs from './components/BoardTabs';

import ResourceSection from './components/ResourceSection';
import Footer from './components/Footer';
import { structure } from './data/structure';
import './App.css';

import { fetchSheetData, transformResources, transformAnnouncements } from './utils/googleSheets';

function App() {
  const [activeStandardId, setActiveStandardId] = useState(structure[0].id);
  const [activeBoard, setActiveBoard] = useState(structure[0].boards[0]);


  // Google Sheet URL from environment variables
  const SHEET_CSV_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;
  
  const RESOURCES_CSV_URL = SHEET_CSV_URL; 
  const ANNOUNCEMENTS_CSV_URL = SHEET_CSV_URL;

  const [resources, setResources] = useState({});
  const [activeStandardData, setActiveStandardData] = useState(structure.find(s => s.id === activeStandardId));

  const handleStandardChange = (id) => {
    setActiveStandardId(id);
    const newStandard = structure.find(s => s.id === id);
    if (newStandard && !newStandard.boards.includes(activeBoard)) {
      setActiveBoard(newStandard.boards[0]);
    }
  };

  const [activeCategory, setActiveCategory] = useState(null);
  const [announcements, setAnnouncements] = useState([]);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch Resources
        // Only fetch if URL is set to something valid (not the placeholder default)
        if (RESOURCES_CSV_URL && !RESOURCES_CSV_URL.includes('...')) {
            const rawResources = await fetchSheetData(RESOURCES_CSV_URL);
            const transformedResources = transformResources(rawResources);
            // Merge with local resources or replace? detailed plan said replace.
            // But for safety, let's mistakenly not break everything if fetch fails or is empty
            if (Object.keys(transformedResources).length > 0) {
                setResources(transformedResources);
            }
        }

        // Fetch Announcements
        if (ANNOUNCEMENTS_CSV_URL && !ANNOUNCEMENTS_CSV_URL.includes('...')) {
            const rawAnnouncements = await fetchSheetData(ANNOUNCEMENTS_CSV_URL);
            const transformedAnnouncements = transformAnnouncements(rawAnnouncements);
            if (transformedAnnouncements.length > 0) {
                setAnnouncements(transformedAnnouncements);
            }
        }
      } catch (error) {
        console.error("Failed to fetch data from sheets:", error);
      }
    };

    loadData();
  }, []);





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
