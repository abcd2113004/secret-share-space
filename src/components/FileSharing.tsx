
import React, { useState, useRef } from 'react';
import './FileSharing.css';

interface FileSharingProps {
  roomId: string;
}

interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  uploadedBy: string;
}

const FileSharing: React.FC<FileSharingProps> = ({ roomId }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('document') || type.includes('word')) return '📝';
    if (type.includes('spreadsheet') || type.includes('excel')) return '📊';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📁';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  };

  const handleFiles = async (fileList: File[]) => {
    setUploading(true);
    
    // Simulate file upload
    for (const file of fileList) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newFile: FileItem = {
        id: Math.random().toString(36).substring(2, 15),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadedAt: new Date(),
        uploadedBy: 'You'
      };
      
      setFiles(prev => [...prev, newFile]);
    }
    
    setUploading(false);
  };

  const handleDownload = (file: FileItem) => {
    // Simulate file download
    console.log(`Downloading ${file.name}`);
  };

  const handleDelete = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  return (
    <div className="file-sharing-container">
      <div className="upload-section">
        <div 
          className={`drop-zone ${isDragging ? 'dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="drop-zone-content">
            {uploading ? (
              <>
                <div className="upload-spinner"></div>
                <p>Uploading files...</p>
              </>
            ) : (
              <>
                <div className="upload-icon">📤</div>
                <h3>Drop files here or click to browse</h3>
                <p>Share any type of file with room members</p>
                <div className="supported-formats">
                  <span>Images</span>
                  <span>Videos</span>
                  <span>Documents</span>
                  <span>Archives</span>
                </div>
              </>
            )}
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="file-input"
        />
      </div>

      {files.length > 0 && (
        <div className="files-list">
          <div className="files-header">
            <h3>Shared Files ({files.length})</h3>
          </div>
          
          <div className="files-grid">
            {files.map((file) => (
              <div key={file.id} className="file-item">
                <div className="file-icon">
                  {getFileIcon(file.type)}
                </div>
                <div className="file-info">
                  <div className="file-name">{file.name}</div>
                  <div className="file-meta">
                    <span>{formatFileSize(file.size)}</span>
                    <span>•</span>
                    <span>{file.uploadedBy}</span>
                    <span>•</span>
                    <span>{file.uploadedAt.toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="file-actions">
                  <button 
                    className="download-btn"
                    onClick={() => handleDownload(file)}
                  >
                    ⬇️
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={() => handleDelete(file.id)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <h3>No files shared yet</h3>
          <p>Upload files to start sharing with room members</p>
        </div>
      )}
    </div>
  );
};

export default FileSharing;
