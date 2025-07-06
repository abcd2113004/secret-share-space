
import React, { useState } from 'react';
import CreateRoom from '../components/CreateRoom';
import ActiveRoom from '../components/ActiveRoom';
import './Index.css';

interface RoomData {
  id: string;
  code: string;
  link: string;
  expiresAt: Date;
  timeLimit: number;
}

const Index = () => {
  const [currentRoom, setCurrentRoom] = useState<RoomData | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleRoomCreated = (roomData: RoomData) => {
    setCurrentRoom(roomData);
    setIsCreating(false);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
  };

  const handleCreateNew = () => {
    setIsCreating(true);
  };

  if (currentRoom) {
    return <ActiveRoom roomData={currentRoom} onLeaveRoom={handleLeaveRoom} />;
  }

  if (isCreating) {
    return <CreateRoom onRoomCreated={handleRoomCreated} onCancel={() => setIsCreating(false)} />;
  }

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="hero-section">
          <h1 className="hero-title">ShareSpace</h1>
          <p className="hero-subtitle">
            Create temporary rooms to share files, messages, and documents securely
          </p>
          <div className="features-list">
            <div className="feature-item">
              <span className="feature-icon">🔗</span>
              <span>Shareable links</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <span>QR codes</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⏰</span>
              <span>Time-limited access</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure sharing</span>
            </div>
          </div>
        </div>
        
        <button className="create-room-btn" onClick={handleCreateNew}>
          <span className="btn-icon">+</span>
          Create New Room
        </button>
        
        <div className="join-section">
          <p className="join-text">Have a room code?</p>
          <div className="join-form">
            <input 
              type="text" 
              placeholder="Enter 6-digit code"
              className="join-input"
              maxLength={6}
            />
            <button className="join-btn">Join Room</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
