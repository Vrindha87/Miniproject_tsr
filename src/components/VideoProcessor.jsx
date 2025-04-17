
// import React, { useState, useEffect } from 'react';


// const VideoProcessor = () => {
//   // API base URL - ngrok URL

//   //const API_BASE_URL = 'https://7d13-35-187-232-12.ngrok-free.app';
//   const [API_BASE_URL, setAPI_BASE_URL] = useState('');
  
//   const [file, setFile] = useState(null);
//   const [isUploading, setIsUploading] = useState(false);
//   const [processingStatus, setProcessingStatus] = useState('');
//   const [result, setResult] = useState(null);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [dragActive, setDragActive] = useState(false);

//   useEffect(() => {
//     const fetchNgrokURL = async () => {
//       try {
//         const response = await fetch('https://ngrok-url-backend.onrender.com/get-ngrok-url');
//         const data = await response.json();
//         setAPI_BASE_URL(data.url);  // The value returned from backend
//       } catch (error) {
//         console.error('Error fetching ngrok URL:', error);
//       }
//     };

//     fetchNgrokURL();
//   }, []);

//   const handleFileChange = (event) => {
//     const selectedFile = event.target.files[0];
//     if (selectedFile && selectedFile.type.includes('video')) {
//       setFile(selectedFile);
//     } else {
//       alert('Please select a valid video file');
//     }
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
    
//     if (e.type === 'dragenter' || e.type === 'dragover') {
//       setDragActive(true);
//     } else if (e.type === 'dragleave') {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
    
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const droppedFile = e.dataTransfer.files[0];
//       if (droppedFile.type.includes('video')) {
//         setFile(droppedFile);
//       } else {
//         alert('Please select a valid video file');
//       }
//     }
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       alert('Please select a video file first');
//       return;
//     }

//     setIsUploading(true);
//     setProcessingStatus('Uploading video...');
//     setUploadProgress(0);

//     const formData = new FormData();
//     formData.append('file', file);

//     try {
//       // Simulate upload progress
//       const progressInterval = setInterval(() => {
//         setUploadProgress(prev => {
//           if (prev >= 95) {
//             clearInterval(progressInterval);
//             return prev;
//           }
//           return prev + 5;
//         });
//       }, 500);

//       const response = await fetch(`${API_BASE_URL}/predict/video/`, {
//         method: 'POST',
//         body: formData,
//       });

//       clearInterval(progressInterval);
//       setUploadProgress(100);

//       if (!response.ok) {
//         throw new Error(`Server responded with ${response.status}`);
//       }

//       const data = await response.json();
//       setResult(data);
//       setProcessingStatus('Video processed successfully!');
//     } catch (error) {
//       console.error('Error uploading video:', error);
//       setProcessingStatus(`Error: ${error.message}`);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   return (
//     <div className="processor-container">
//       <div className="info-section">
        
//         <p style={{ fontWeight: 'bold', fontSize: '24px', textAlign : 'center' }}>Upload video</p>
//       </div>

//       <div className="upload-section">
//         <div 
//           className={`upload-area ${dragActive ? 'drag-active' : ''}`}
//           onDragEnter={handleDrag}
//           onDragLeave={handleDrag}
//           onDragOver={handleDrag}
//           onDrop={handleDrop}
//         >
//           <input
//             type="file"
//             id="video-upload"
//             accept="video/*"
//             onChange={handleFileChange}
//             className="file-input"
//             disabled={isUploading}
//           />
//           <label
//             htmlFor="video-upload"
//             className="upload-label"
//           >
//             <svg className="upload-icon" style={{ width: '50px', height: '50px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
//             </svg>
//             <p className="upload-text">
//               {file ? `Selected: ${file.name}` : 'Click to select a video or drag and drop here'}
//             </p>
//             {!file && <p className="upload-hint">Supports: MP4, AVI, MOV, etc.</p>}
//           </label>
//         </div>

//         {file && (
//           <div className="action-buttons">
//             <button
//               onClick={handleUpload}
//               disabled={isUploading}
//               className="process-button"
//             >
//               {isUploading ? (
//                 <span className="processing-indicator">
//                   <svg className="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Processing...
//                 </span>
//               ) : 'Process Video'}
//             </button>
//           </div>
//         )}
//       </div>

//       {isUploading && (
//         <div className="progress-section">
//           <p className="status-text">{processingStatus}</p>
//           <div className="progress-bar-container">
//             <div
//               className="progress-bar"
//               style={{ width: `${uploadProgress}%` }}
//             ></div>
//           </div>
//           <p className="progress-percentage">{uploadProgress}%</p>
//         </div>
//       )}

//       {result && (
//         <div className="results-section">
//           <h2 className="results-title">Processing Results</h2>
//           <p className="results-status">
//             <span className="status-label">Status:</span> {processingStatus}
//           </p>
//           <p className="results-info">
//             <span className="info-label">Frames Processed:</span> {result.frames_processed}
//           </p>
          
//           <div className="video-section">
//             <h3 className="video-title">Processed Video:</h3>
//             <div className="video-container">
//               <video 
//                 controls 
//                 className="result-video"
//               >
//                 <source src={`${API_BASE_URL}${result.direct_file_url}`} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             </div>
            
//             <div className="download-section">
//               <a
//                 href={`${API_BASE_URL}${result.download_url}`}
//                 download
//                 className="download-button"
//               >
//                 <svg className="download-icon" style={{ width: '50px', height: '50px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
//                 </svg>
//                 Download Processed Video
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoProcessor;



import React, { useState, useEffect } from 'react';

const VideoProcessor = () => {
  // API base URL - ngrok URL
  const [API_BASE_URL, setAPI_BASE_URL] = useState('');
  
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [result, setResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    const fetchNgrokURL = async () => {
      try {
        const response = await fetch('https://ngrok-url-backend.onrender.com/get-ngrok-url');
        const data = await response.json();
        setAPI_BASE_URL(data.url);  // The value returned from backend
      } catch (error) {
        console.error('Error fetching ngrok URL:', error);
      }
    };

    fetchNgrokURL();
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.includes('video')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid video file');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.includes('video')) {
        setFile(droppedFile);
      } else {
        alert('Please select a valid video file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a video file first');
      return;
    }

    setIsUploading(true);
    setProcessingStatus('Uploading video...');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      const response = await fetch(`${API_BASE_URL}/predict/video/`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
      setProcessingStatus('Video processed successfully!');
    } catch (error) {
      console.error('Error uploading video:', error);
      setProcessingStatus(`Error: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="processor-container">
      <div className="info-section">
        <p style={{ fontWeight: 'bold', fontSize: '24px', textAlign : 'center' }}>Upload video</p>
      </div>

      <div className="upload-section">
        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="video-upload"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input"
            disabled={isUploading}
          />
          <label
            htmlFor="video-upload"
            className="upload-label"
          >
            <svg className="upload-icon" style={{ width: '50px', height: '50px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p className="upload-text">
              {file ? `Selected: ${file.name}` : 'Click to select a video or drag and drop here'}
            </p>
            {!file && <p className="upload-hint">Supports: MP4, AVI, MOV, etc.</p>}
          </label>
        </div>

        {file && (
          <div className="action-buttons">
            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="process-button"
            >
              {isUploading ? (
                <span className="processing-indicator">
                  <svg className="spinner-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : 'Process Video'}
            </button>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="progress-section">
          <p className="status-text">{processingStatus}</p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="progress-percentage">{uploadProgress}%</p>
        </div>
      )}

      {result && (
        <div className="results-section">
          <h2 className="results-title">Processing Results</h2>
          <p className="results-status">
            <span className="status-label">Status:</span> {processingStatus}
          </p>
          <p className="results-info">
            <span className="info-label">Frames Processed:</span> {result.frames_processed}
          </p>
          
          <div className="download-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '10px' }}>
            <a
              href={`${API_BASE_URL}${result.download_url}`}
              download
              className="download-button"
            >
              <svg className="download-icon" style={{ width: '50px', height: '50px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              Download Processed Video
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoProcessor;