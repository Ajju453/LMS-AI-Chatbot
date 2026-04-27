import React, { useState } from 'react';
import Chatbot from '../components/Chatbot';
import StudentDashboard from '../components/StudentDashboard';
import './HomePage.css';
import { FiMenu, FiX } from 'react-icons/fi';

const HomePage = () => {
  const [studentId, setStudentId] = useState(null);
  const [inputStudentId, setInputStudentId] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleStudentIdSubmit = (e) => {
    e.preventDefault();
    if (inputStudentId.trim()) {
      setStudentId(inputStudentId.trim());
      setInputStudentId('');
    }
  };

  const handleLogout = () => {
    setStudentId(null);
    setActiveTab('dashboard');
  };

  return (
    <div className="home-page">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <h1>📚 Learning Path Dashboard</h1>
              <p>AI-Powered Learning Assistant</p>
            </div>
            {studentId && (
              <div className="student-info-header">
                <span>Student ID: {studentId}</span>
                <button className="logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {!studentId ? (
        <div className="login-container">
          <div className="login-card">
            <h2>Welcome to Learning Path Dashboard</h2>
            <p>Enter your Student ID to access your personalized learning experience</p>
            
            <form onSubmit={handleStudentIdSubmit}>
              <input
                type="text"
                placeholder="Enter your Student ID"
                value={inputStudentId}
                onChange={(e) => setInputStudentId(e.target.value)}
                required
                autoFocus
              />
              <button type="submit">Login</button>
            </form>

            <div className="features">
              <h3>Features:</h3>
              <ul>
                <li>🤖 AI Chatbot Assistant - Get instant help anytime</li>
                <li>📊 Student Dashboard - Track your progress</li>
                <li>✓ Attendance Tracking - Monitor your attendance</li>
                <li>⚠️ Backlog Management - Clear subjects requiring focus</li>
                <li>📈 Monthly Reports - Detailed performance analysis</li>
                <li>💡 Smart Tutoring - Topic-wise learning guidance</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="main-content">
          <div className="container">
            <div className="content-wrapper">
              {/* Mobile Menu */}
              <button
                className="mobile-menu-btn"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>

              {/* Sidebar Navigation */}
              <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <nav className="nav-menu">
                  <button
                    className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('dashboard');
                      setSidebarOpen(false);
                    }}
                  >
                    📊 Dashboard
                  </button>
                  <button
                    className={`nav-item ${activeTab === 'chatbot' ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab('chatbot');
                      setSidebarOpen(false);
                    }}
                  >
                    🤖 ChatBot
                  </button>
                </nav>
              </aside>

              {/* Content Area */}
              <main className="content-area">
                {activeTab === 'dashboard' && (
                  <StudentDashboard studentId={studentId} />
                )}
                {activeTab === 'chatbot' && (
                  <div className="chatbot-wrapper">
                    <Chatbot studentId={studentId} />
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      )}

      <footer className="app-footer">
        <p>&copy; 2024 Learning Path Dashboard. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
