import React, { useState } from 'react';
import './App.css';

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [recognitionResults, setRecognitionResults] = useState(null);
  const [currentPage, setCurrentPage] = useState('upload');

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        // Simulated recognition process
        simulateSignRecognition(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const simulateSignRecognition = (imageData) => {
    // Simulated recognition results - replace with actual ML model call
    const mockResults = [
      { 
        signName: 'Speed Limit 30', 
        confidenceScore: 0.92,
        description: 'Maximum speed of 30 km/h in urban areas'
      },
      { 
        signName: 'No Overtaking', 
        confidenceScore: 0.85,
        description: 'Prohibited to overtake other vehicles'
      }
    ];

    setRecognitionResults(mockResults);
    setCurrentPage('results');
  };

  // Replace the UploadPage and ResultsPage components in the previous App.js
// Keep all other code the same

const UploadPage = () => (
  <div className="App upload-page">
    <div className="upload-container">
      <div className="header-section">
        <div className="icon-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="upload-icon">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5-5 5 5M12 15V3"/>
          </svg>
        </div>
        <h1>Traffic Sign Detection</h1>
        <p>Upload an image of a traffic sign in challenging visibility</p>
      </div>
      
      <div className="upload-section">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageUpload}
          className="file-input"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="upload-button">
          <span>Choose File</span>
        </label>
        <p className="file-hint">Supports: JPG, PNG, WEBP</p>
      </div>
    </div>
  </div>
);

const ResultsPage = () => (
  <div className="App results-page">
    <div className="results-container">
      <div className="results-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="check-icon">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h1>Detection Results</h1>
      </div>
      
      {uploadedImage && (
        <div className="uploaded-image-preview">
          <img src={uploadedImage} alt="Uploaded Traffic Sign" />
        </div>
      )}

      <div className="recognition-results-grid">
        {recognitionResults && recognitionResults.map((result, index) => (
          <div key={index} className="result-card">
            <div className="result-header">
              <h3>{result.signName}</h3>
              <div className="confidence-badge">
                {(result.confidenceScore * 100).toFixed(2)}%
              </div>
            </div>
            <p className="result-description">{result.description}</p>
          </div>
        ))}
      </div>

      <button 
        className="back-to-upload-button"
        onClick={() => setCurrentPage('upload')}
      >
        Upload New Image
      </button>
    </div>
  </div>
);

  

  return (
    <div>
      {currentPage === 'upload' ? <UploadPage /> : <ResultsPage />}
    </div>
  );
}

export default App;