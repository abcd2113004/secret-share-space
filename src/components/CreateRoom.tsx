
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import './CreateRoom.css';

interface CreateRoomProps {
  onRoomCreated: (roomData: any) => void;
  onCancel: () => void;
}

const CreateRoom: React.FC<CreateRoomProps> = ({ onRoomCreated, onCancel }) => {
  const [timeLimit, setTimeLimit] = useState(30);
  const [customTime, setCustomTime] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const timeLimitOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 180, label: '3 hours' },
    { value: 360, label: '6 hours' },
  ];

  const generateRoomCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const generateRoomId = () => {
    return Math.random().toString(36).substring(2, 15);
  };

  const handleCreate = async () => {
    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const finalTimeLimit = isCustom ? parseInt(customTime) : timeLimit;
      const roomCode = generateRoomCode();
      const roomId = generateRoomId();
      const expiresAt = new Date(Date.now() + finalTimeLimit * 60 * 1000);
      
      const roomData = {
        id: roomId,
        code: roomCode,
        link: `${window.location.origin}/room/${roomId}`,
        expiresAt,
        timeLimit: finalTimeLimit,
      };
      
      onRoomCreated(roomData);
    }, 1500);
  };

  return (
    <div className="create-room-container">
      <div className="create-room-content">
        <div className="create-room-header">
          <h2>Create New Room</h2>
          <p>Set up your temporary sharing space</p>
        </div>

        <div className="time-limit-section">
          <div className="section-header">
            <Clock size={20} />
            <span>Room Duration</span>
          </div>
          
          <div className="time-options">
            {timeLimitOptions.map((option) => (
              <button
                key={option.value}
                className={`time-option ${timeLimit === option.value && !isCustom ? 'active' : ''}`}
                onClick={() => {
                  setTimeLimit(option.value);
                  setIsCustom(false);
                }}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="custom-time-section">
            <button
              className={`custom-time-btn ${isCustom ? 'active' : ''}`}
              onClick={() => setIsCustom(true)}
            >
              Custom Duration
            </button>
            {isCustom && (
              <div className="custom-time-input">
                <input
                  type="number"
                  placeholder="Minutes"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  min="5"
                  max="1440"
                />
                <span>minutes</span>
              </div>
            )}
          </div>
        </div>

        <div className="room-features">
          <h4>Your room will include:</h4>
          <ul>
            <li>📁 File sharing (drag & drop)</li>
            <li>💬 Real-time messaging</li>
            <li>📱 QR code access</li>
            <li>🔗 Shareable link</li>
            <li>🔢 6-digit access code</li>
          </ul>
        </div>

        <div className="create-room-actions">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className={`create-btn ${isCreating ? 'creating' : ''}`}
            onClick={handleCreate}
            disabled={isCreating || (isCustom && !customTime)}
          >
            {isCreating ? (
              <>
                <span className="spinner"></span>
                Creating Room...
              </>
            ) : (
              'Create Room'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
