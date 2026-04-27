import React, { useState, useRef, useEffect } from 'react';
import './Chatbot.css';
import { chatbotAPI } from '../services/api';
import { FiSend, FiLoader, FiRefreshCw, FiTrash2 } from 'react-icons/fi';

const Chatbot = ({ studentId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Load chat history on component mount
  useEffect(() => {
    if (studentId) {
      loadChatHistory();
    }
  }, [studentId]);

  // Auto scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadChatHistory = async () => {
    try {
      const response = await chatbotAPI.getChatHistory(studentId);
      if (response.data.success) {
        // Reverse to show oldest first
        setMessages(response.data.history.reverse());
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    // Add user message to UI
    const userMsg = { 
      userMessage: inputMessage, 
      botResponse: '', 
      timestamp: new Date().toISOString(),
      messageType: 'USER'
    };
    
    setMessages([...messages, userMsg]);
    setInputMessage('');
    setLoading(true);
    setError('');

    try {
      const response = await chatbotAPI.sendMessage(studentId, inputMessage);
      
      if (response.data.success) {
        // Add bot response
        const botMsg = {
          userMessage: inputMessage,
          botResponse: response.data.message,
          timestamp: new Date().toISOString(),
          messageType: 'BOT'
        };
        
        setMessages(prev => [...prev.slice(0, -1), botMsg]);
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
      // Remove the last user message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (window.confirm('Are you sure you want to clear chat history?')) {
      try {
        await chatbotAPI.clearChatHistory(studentId);
        setMessages([]);
        setError('');
      } catch (err) {
        setError('Failed to clear history');
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h3>Learning Assistant</h3>
        <div className="header-actions">
          <button 
            className="icon-btn" 
            onClick={loadChatHistory}
            title="Refresh"
            disabled={loading}
          >
            <FiRefreshCw size={18} />
          </button>
          <button 
            className="icon-btn danger" 
            onClick={handleClearHistory}
            title="Clear history"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>

      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <p>Hi! I'm your Learning Assistant</p>
            <p className="subtitle">Ask me about:</p>
            <ul>
              <li>📚 Backlog subjects and study plans</li>
              <li>✓ Your attendance record</li>
              <li>📊 Monthly reports and performance</li>
              <li>💡 Topic explanations and help</li>
              <li>⏰ Study schedules and tips</li>
            </ul>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className="message-group">
            <div className="message user-message">
              <div className="message-content">
                {msg.userMessage}
              </div>
              <span className="message-time">{formatTime(msg.timestamp)}</span>
            </div>
            
            {msg.botResponse && (
              <div className="message bot-message">
                <div className="message-content">
                  {msg.botResponse.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <span className="message-time">{formatTime(msg.timestamp)}</span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="message-group">
            <div className="message bot-message loading">
              <FiLoader className="spinner" />
              <span>Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Ask me anything about your learning path..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <button 
          type="submit" 
          disabled={loading || !inputMessage.trim()}
          className="send-btn"
        >
          {loading ? <FiLoader className="spinner" /> : <FiSend size={20} />}
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
