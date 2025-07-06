
import React, { useState, useRef, useEffect } from 'react';
import { QrCode, Link, Clock } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import FileSharing from './FileSharing';
import ChatInterface from './ChatInterface';
import './ActiveRoom.css';

interface ActiveRoomProps {
  roomData: {
    id: string;
    code: string;
    link: string;
    expiresAt: Date;
    timeLimit: number;
  };
  onLeaveRoom: () => void;
}

const ActiveRoom: React.FC<ActiveRoomProps> = ({ roomData, onLeaveRoom }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'chat'>('files');
  const [timeRemaining, setTimeRemaining] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = roomData.expiresAt.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }
      
      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [roomData.expiresAt]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="active-room-container">
      <div className="room-header">
        <div className="room-info">
          <h1>Room Active</h1>
          <div className="room-details">
            <div className="detail-item">
              <span className="detail-label">Room Code:</span>
              <span className="room-code">{roomData.code}</span>
              <button 
                className={`copy-btn ${copied === 'code' ? 'copied' : ''}`}
                onClick={() => copyToClipboard(roomData.code, 'code')}
              >
                {copied === 'code' ? '✓' : '📋'}
              </button>
            </div>
            <div className="detail-item">
              <Clock size={16} />
              <span className={`time-remaining ${timeRemaining === 'Expired' ? 'expired' : ''}`}>
                {timeRemaining === 'Expired' ? 'Expired' : `${timeRemaining} remaining`}
              </span>
            </div>
          </div>
        </div>
        
        <div className="room-actions">
          <button 
            className="action-btn qr-btn"
            onClick={() => setShowQR(true)}
          >
            <QrCode size={16} />
            QR Code
          </button>
          <button 
            className={`action-btn link-btn ${copied === 'link' ? 'copied' : ''}`}
            onClick={() => copyToClipboard(roomData.link, 'link')}
          >
            <Link size={16} />
            {copied === 'link' ? 'Copied!' : 'Copy Link'}
          </button>
          <button className="leave-btn" onClick={onLeaveRoom}>
            Leave Room
          </button>
        </div>
      </div>

      <div className="room-content">
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'files' ? 'active' : ''}`}
            onClick={() => setActiveTab('files')}
          >
            📁 Files
          </button>
          <button 
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
          >
            💬 Chat
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'files' ? (
            <FileSharing roomId={roomData.id} />
          ) : (
            <ChatInterface roomId={roomData.id} />
          )}
        </div>
      </div>

      {showQR && (
        <QRCodeGenerator 
          link={roomData.link}
          code={roomData.code}
          onClose={() => setShowQR(false)}
        />
      )}
    </div>
  );
};

export default ActiveRoom;
