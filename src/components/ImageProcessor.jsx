import React, { useState, useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

function ImageProcessor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [detections, setDetections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const canvasRef = useRef(null);
  
  // API endpoint - update this to your ngrok URL
  //const API_URL = 'https://7d13-35-187-232-12.ngrok-free.app';
  const [API_URL, setAPI_URL] = useState('');

  useEffect(() => {
    const fetchNgrokURL = async () => {
      try {
        const response = await fetch('https://ngrok-url-backend.onrender.com/get-ngrok-url');
        const data = await response.json();
        setAPI_URL(data.url);  // The value returned from backend
      } catch (error) {
        console.error('Error fetching ngrok URL:', error);
      }
    };

    fetchNgrokURL();
  }, []);
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setDetections([]);
      setError(null);
      setProcessedImage(null);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image first');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch(`${API_URL}/predict/image/`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      setDetections(data.detections || []);
    } catch (err) {
      setError(`Error processing image: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Draw detections on canvas when detections or preview changes
  useEffect(() => {
    if (preview && detections.length > 0) {
      const img = new Image();
      img.src = preview;
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the original image on canvas
        ctx.drawImage(img, 0, 0);
        
        // Draw bounding boxes, labels and confidence scores
        detections.forEach(detection => {
          const { x_min, y_min, x_max, y_max, class: className, confidence } = detection;
          
          // Calculate coordinates
          const x = Math.round(x_min);
          const y = Math.round(y_min);
          const width = Math.round(x_max - x_min);
          const height = Math.round(y_max - y_min);
          
          // Draw bounding box
          ctx.lineWidth = 3;
          ctx.strokeStyle = 'red';
          ctx.strokeRect(x, y, width, height);
          
          // Create background for text
          ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
          const confText = `${(confidence * 100).toFixed(1)}%`;
          const labelWidth = ctx.measureText(`${className}: ${confText}`).width + 10;
          ctx.fillRect(x, y - 25, labelWidth, 25);
          
          // Draw text (class name and confidence)
          ctx.fillStyle = 'white';
          ctx.font = 'bold 16px Arial';
          ctx.fillText(`${className}: ${confText}`, x + 5, y - 7);
        });
        
        // Convert canvas to image URL
        setProcessedImage(canvas.toDataURL('image/png'));
      };
    }
  }, [detections, preview]);
  
  return (
    <div className="processor-container p-4">
      <div className="upload-section mb-6">
        <h2 className="text-xl font-bold mb-4">Upload Image</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="file-input-container">
            <label className="file-input-label cursor-pointer bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center justify-center">
              <input 
                type="file" 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              <div className="upload-button flex items-center space-x-2">
                <Camera size={24} />
                <span>Select Image</span>
              </div>
            </label>
            {file && <p className="file-name mt-2 text-sm">{file.name}</p>}
          </div>
          
          <button 
            type="submit" 
            className="process-button bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
            disabled={!file || isLoading}
          >
            {isLoading ? 'Processing...' : 'Process Image'}
          </button>
        </form>
      </div>
      
      {error && <div className="error-message bg-red-100 border border-red-400 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <div className="results-container">
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image display area */}
          <div className="image-container">
            {processedImage ? (
              <div className="image-preview">
                <h3 className="text-lg font-semibold mb-2">Detection Results</h3>
                <img 
                  src={processedImage} 
                  alt="Detection Results" 
                  className="border rounded max-w-full h-auto"
                />
              </div>
            ) : preview && (
              <div className="image-preview">
                <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="border rounded max-w-full h-auto"
                />
              </div>
            )}
          </div>
          
          {/* Detection results table */}
          {detections.length > 0 && (
            <div className="detections-container">
              <h3 className="text-lg font-semibold mb-2">Detection Summary</h3>
              <div className="overflow-x-auto">
                <table className="detections-table min-w-full border-collapse border">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2 text-left">Class</th>
                      <th className="border p-2 text-left">Confidence</th>
                      <th className="border p-2 text-left">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detections.map((detection, index) => (
                      <tr key={index} className="even:bg-gray-50">
                        <td className="border p-2">{detection.class}</td>
                        <td className="border p-2">{(detection.confidence * 100).toFixed(2)}%</td>
                        <td className="border p-2">
                          ({Math.round(detection.x_min)}, {Math.round(detection.y_min)}) - 
                          ({Math.round(detection.x_max)}, {Math.round(detection.y_max)})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageProcessor;