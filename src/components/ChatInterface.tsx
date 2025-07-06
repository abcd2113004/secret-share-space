
import React, { useState, useRef, useEffect } from 'react';
import './ChatInterface.css';

interface ChatInterfaceProps {
  roomId: string;
}

interface Message {
  id: string;
  text: string;
  sender: string;
  timestamp: Date;
  isOwn: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ roomId }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Welcome to the room! You can now share messages with other participants.',
      sender: 'System',
      timestamp: new Date(),
      isOwn: false
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Math.random().toString(36).substring(2, 15),
      text: newMessage.trim(),
      sender: 'You',
      timestamp: new Date(),
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response from another user after a delay
    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        const responses = [
          "Thanks for sharing!",
          "Got it, looks good!",
          "Perfect, I'll check that out.",
          "Awesome, thanks!",
          "That's exactly what we needed.",
        ];
        
        const response: Message = {
          id: Math.random().toString(36).substring(2, 15),
          text: responses[Math.floor(Math.random() * responses.length)],
          sender: 'Room Member',
          timestamp: new Date(),
          isOwn: false
        };
        
        setMessages(prev => [...prev, response]);
        setIsTyping(false);
      }, 1500);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h3>Room Chat</h3>
        <div className="online-status">
          <div className="status-indicator"></div>
          <span>2 members online</span>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message ${message.isOwn ? 'own' : 'other'} ${message.sender === 'System' ? 'system' : ''}`}
          >
            {!message.isOwn && message.sender !== 'System' && (
              <div className="message-sender">{message.sender}</div>
            )}
            <div className="message-content">
              <div className="message-text">{message.text}</div>
              <div className="message-time">{formatTime(message.timestamp)}</div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="message other">
            <div className="message-sender">Room Member</div>
            <div className="message-content typing">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSendMessage}>
        <div className="input-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
          />
          <button 
            type="submit" 
            className="send-button"
            disabled={!newMessage.trim()}
          >
            <span className="send-icon">➤</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
