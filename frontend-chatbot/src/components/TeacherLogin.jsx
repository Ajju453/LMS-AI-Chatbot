import React, { useState } from 'react';
import './TeacherLogin.css';

const TeacherLogin = ({ onLoginSuccess, onBackToStudent }) => {
  const [teacherName, setTeacherName] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModeSelection, setShowModeSelection] = useState(false);
  const [authenticatedTeacher, setAuthenticatedTeacher] = useState(null);

  // Teachers with hardcoded passwords (in production, use secure backend)
  const teachers = [
    { id: 1, name: 'Dr. Rajesh Kumar', password: 'teacher123' },
    { id: 2, name: 'Prof. Priya Sharma', password: 'teacher123' },
    { id: 3, name: 'Dr. Arjun Gupta', password: 'teacher123' },
    { id: 4, name: 'Prof. Neha Patel', password: 'teacher123' },
    { id: 5, name: 'Dr. Vikram Singh', password: 'teacher123' },
    { id: 6, name: 'Prof. Snehal Patil', password: 'teacher123' }
  ];

  const handleTeacherSelect = (teacher) => {
    setSelectedTeacher(teacher);
    setTeacherName(teacher.name);
    setPassword('');
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate inputs
      if (!teacherName.trim()) {
        setError('Please select a teacher');
        setLoading(false);
        return;
      }

      if (!password.trim()) {
        setError('Please enter password');
        setLoading(false);
        return;
      }

      // Find teacher
      const teacher = teachers.find(t => t.name === teacherName);
      if (!teacher) {
        setError('Teacher not found');
        setLoading(false);
        return;
      }

      // Verify password
      if (password !== teacher.password) {
        setError('Invalid password');
        setLoading(false);
        return;
      }

      // Simulate backend call with delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Login successful - show mode selection
      setAuthenticatedTeacher({
        id: teacher.id,
        name: teacher.name,
        role: 'teacher'
      });
      setShowModeSelection(true);

    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="teacher-login-container">
      <button className="back-to-student-btn" onClick={onBackToStudent}>
        ← Back to Student Login
      </button>

      {/* Mode Selection Modal */}
      {showModeSelection && authenticatedTeacher && (
        <div className="mode-selection-modal">
          <div className="mode-selection-content">
            <h2>Welcome, {authenticatedTeacher.name}! 👋</h2>
            <p>What would you like to do?</p>
            
            <div className="mode-options">
              <button 
                className="mode-btn dashboard-btn"
                onClick={() => {
                  onLoginSuccess({ ...authenticatedTeacher, mode: 'dashboard' });
                }}
              >
                <div className="mode-icon">📊</div>
                <div className="mode-title">Teacher Dashboard</div>
                <div className="mode-desc">View students, grades, attendance & curriculum</div>
              </button>
              
              <button 
                className="mode-btn chat-btn"
                onClick={() => {
                  onLoginSuccess({ ...authenticatedTeacher, mode: 'chat' });
                }}
              >
                <div className="mode-icon">💬</div>
                <div className="mode-title">Chat with AI</div>
                <div className="mode-desc">Ask AI about students, subjects & analytics</div>
              </button>
            </div>
            
            <button 
              className="back-btn"
              onClick={() => {
                setShowModeSelection(false);
                setAuthenticatedTeacher(null);
                setSelectedTeacher(null);
                setTeacherName('');
                setPassword('');
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}

      {/* Login Form */}
      {!showModeSelection && (
        <div className="teacher-login-form">
        <div className="login-header">
          <h2>👨‍🏫 Teacher Portal Login</h2>
          <p>Access your classroom dashboard and student management tools</p>
        </div>

        {!selectedTeacher ? (
          <div className="teacher-selection">
            <h3>Select Your Profile</h3>
            <div className="teachers-grid">
              {teachers.map(teacher => (
                <div
                  key={teacher.id}
                  className="teacher-card"
                  onClick={() => handleTeacherSelect(teacher)}
                >
                  <div className="teacher-avatar">👨</div>
                  <p className="teacher-name">{teacher.name}</p>
                  <span className="click-hint">Click to log in</span>
                </div>
              ))}
            </div>
            <p className="teachers-hint">Default password: teacher123</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="password-form">
            <div className="selected-teacher-display">
              <div className="selected-avatar">👨</div>
              <p className="selected-name">{selectedTeacher.name}</p>
              <button 
                type="button" 
                className="change-teacher-btn"
                onClick={() => {
                  setSelectedTeacher(null);
                  setTeacherName('');
                  setPassword('');
                  setError('');
                }}
              >
                Change Profile
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter your password"
                disabled={loading}
                autoFocus
              />
            </div>

            {error && <div className="error-message">⚠️ {error}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={loading || !password}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verifying...
                </>
              ) : (
                <>
                  🔓 Sign In
                </>
              )}
            </button>

            <div className="demo-note">
              <p>📝 <strong>Demo Mode:</strong> Use any teacher with password "teacher123"</p>
            </div>
          </form>
        )}

        <div className="login-footer">
          <p>Need help? Contact the IT Department</p>
        </div>
        </div>
      )}
    </div>
  );
};

export default TeacherLogin;
