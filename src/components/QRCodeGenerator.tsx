
import React from 'react';
import './QRCodeGenerator.css';

interface QRCodeGeneratorProps {
  link: string;
  code: string;
  onClose: () => void;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ link, code, onClose }) => {
  // Simple QR code placeholder - in production, you'd use a real QR library
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;

  return (
    <div className="qr-overlay" onClick={onClose}>
      <div className="qr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="qr-header">
          <h3>Share Room Access</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="qr-content">
          <div className="qr-code-section">
            <div className="qr-code-container">
              <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
            </div>
            <p className="qr-description">Scan to join room</p>
          </div>
          
          <div className="access-methods">
            <div className="method">
              <span className="method-label">Room Code</span>
              <div className="method-value">
                <span className="code-display">{code}</span>
                <button 
                  className="copy-method-btn"
                  onClick={() => navigator.clipboard.writeText(code)}
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div className="method">
              <span className="method-label">Direct Link</span>
              <div className="method-value">
                <span className="link-display">{link}</span>
                <button 
                  className="copy-method-btn"
                  onClick={() => navigator.clipboard.writeText(link)}
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
