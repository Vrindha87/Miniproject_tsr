// File: App.jsx
import React, { useState } from 'react';
import './App.css';
import ImageProcessor from './components/ImageProcessor';
import VideoProcessor from './components/VideoProcessor';
import Header from './components/Header';

// function App() {
//   const [activeTab, setActiveTab] = useState('image');

//   return (
//     <div className="app-container">
//       <Header />
      
//       <div className="tab-selector">
//         <button 
//           className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
//           onClick={() => setActiveTab('image')}
//         >
//           Image Processing
//         </button>
//         <button 
//           className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
//           onClick={() => setActiveTab('video')}
//         >
//           Video Processing
//         </button>
//       </div>
      
//       <div className="content-container">
//         {activeTab === 'image' ? <ImageProcessor /> : <VideoProcessor />}
//       </div>
//     </div>
//   );
// }

function App() {
  const [activeTab, setActiveTab] = useState('image');

  return (
    <div className="app-container">
      <div className="center-content">
        <Header />
        
        <div className="tab-selector">
          <button 
            className={`tab-button ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
          >
            Image Processing
          </button>
          <button 
            className={`tab-button ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            Video Processing
          </button>
        </div>
        
        <div className="content-container">
          {activeTab === 'image' ? <ImageProcessor /> : <VideoProcessor />}
        </div>
      </div>
    </div>
  );
}

export default App;