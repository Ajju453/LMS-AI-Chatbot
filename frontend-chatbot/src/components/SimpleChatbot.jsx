import React, { useState, useEffect, useRef } from 'react';
import './SimpleChatbot.css';
import TeacherLogin from './TeacherLogin';
import TeacherDashboard from './TeacherDashboard';

const SimpleChatbot = () => {
  // Auth states
  const [mode, setMode] = useState('student'); // 'student', 'teacherLogin', 'teacherDashboard', 'teacherChat'
  const [authenticatedTeacher, setAuthenticatedTeacher] = useState(null);
  
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: '👋 Welcome to Academic Assistant! I can help you with academic information.\n\n🔐 Please provide your Roll Number to access your personal information (attendance, grades, enrolled subjects).\nExample: 2223810, 2223815, 2223850, etc.\n\nOr ask about:\n📚 All Available Subjects\n👨‍🏫 Teachers & Instructors\n📖 Study Plans & Curriculum',
      timestamp: new Date().toLocaleTimeString(),
      interactive: true
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [geminiKey] = useState('AIzaSyBbTablV7KodqKbn0sOwwCuLMvi_v3TsXI');
  const [authenticatedStudentId, setAuthenticatedStudentId] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const cleanText = (text) => {
    if (!text) return '';
    return text
      .replace(/\*\*/g, '')
      .replace(/__/g, '')
      .replace(/\*/g, '')
      .replace(/_/g, '')
      .replace(/^#+\s/gm, '')
      .replace(/^\d+\.\s/gm, '')
      .replace(/^[-*]\s/gm, '')
      .replace(/\[(.*?)\]\((.*?)\)/g, '$1')
      .trim();
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleQuickAction = async (action) => {
    switch(action) {
      case 'attendance':
        setInputMessage('Show my attendance');
        break;
      case 'grades':
        setInputMessage('Show my grades');
        break;
      case 'subjects':
        setInputMessage('Show my subjects');
        break;
      case 'semester':
        setInputMessage('What semester im I in');
        break;
      case 'teachers':
        setInputMessage('Show all teachers');
        break;
      case 'allsubjects':
        setInputMessage('Show all subjects');
        break;
      default:
        setInputMessage(action);
    }
  };

  const isHeadline = (line, nextLine) => {
    const trimmed = line.trim();
    // Check if line is short, contains a colon, or ends with colon/number
    if (!trimmed) return false;
    if (trimmed.length > 80) return false;
    if (trimmed.endsWith(':')) return true;
    if (trimmed.match(/^[A-Z][a-zA-Z\s]+(?:\d+)?$/)) {
      // Check if next line exists and is longer (indicating it's descriptive content)
      return nextLine && nextLine.trim().length > trimmed.length;
    }
    return false;
  };

  const formatMessage = (text) => {
    const cleaned = cleanText(text);
    if (!cleaned) return null;
    
    const lines = cleaned.split('\n').filter(line => line.trim());
    const elements = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = i + 1 < lines.length ? lines[i + 1] : null;
      const trimmed = line.trim();
      
      if (isHeadline(trimmed, nextLine)) {
        // Render as headline with larger font and top margin
        elements.push(
          <h3 key={i} style={{ 
            marginTop: '20px', 
            marginBottom: '10px', 
            fontWeight: 'bold', 
            fontSize: '16px',
            color: '#333'
          }}>
            {trimmed}
          </h3>
        );
      } else {
        // Render as regular paragraph
        elements.push(
          <p key={i} style={{ 
            marginBottom: '12px', 
            lineHeight: '1.6',
            color: '#555'
          }}>
            {trimmed}
          </p>
        );
      }
    }
    
    return elements;
  };

  const getSimpleResponse = (userMessage) => {
    // Check for specific academic queries and mention authentication if needed
    const lowercaseMsg = userMessage.toLowerCase();
    
    if (lowercaseMsg.includes('my') && (lowercaseMsg.includes('attendance') || lowercaseMsg.includes('grade') || lowercaseMsg.includes('subject'))) {
      return '🔐 To access your personal academic data, please authenticate first by providing your Roll Number (format: 2223810-2223889)';
    }
    
    return `I'm your Academic Assistant powered by AI. I can help you with \n- Available subjects and courses\n- Teacher information\n- Study plans and curriculum\n\nFor personal data (attendance, grades, enrolled subjects), provide your Roll Number first.`;
  };

  const callBackendAPI = async (endpoint) => {
    try {
      console.log('📡 Calling backend API:', endpoint);
      const url = `http://localhost:8080/api/chatbot/data${endpoint}`;
      console.log('🔗 Full URL:', url);
      const response = await fetch(url);
      
      console.log('📬 Response Status:', response.status);
      const data = await response.json();
      console.log('📨 Response Data:', data);
      
      if (!response.ok) {
        console.error('Backend API error:', response.status);
        return null;
      }
      
      return data.success ? data.data : null;
    } catch (err) {
      console.error('Backend API fetch error:', err);
      return null;
    }
  };

  const authenticateStudent = async (studentId) => {
    console.log('🔐 Authenticating student:', studentId);
    const studentData = await callBackendAPI(`/student/${studentId}/profile`);
    
    if (studentData) {
      setAuthenticatedStudentId(studentId);
      setStudentInfo(studentData);
      console.log('✅ Student authenticated:', studentData);
      return studentData; // Return the data instead of just true
    } else {
      console.log('❌ Student ID not found:', studentId);
      return null;
    }
  };

  const handleStudentMessage = async (userMessage) => {
    const trimmedMsg = userMessage.trim();
    const lowercaseMsg = trimmedMsg.toLowerCase();
    
    // If already authenticated, skip the authentication step and go to queries
    if (!authenticatedStudentId) {
      // Check if trying to authenticate with a student ID (format: STU### or 7-digit roll number)
      const studentIdPattern = /^(stu\d{3}|\d{7})$/i;
      if (studentIdPattern.test(trimmedMsg)) {
        const authData = await authenticateStudent(trimmedMsg);
        if (authData) {
          return {
            text: `✅ Authentication successful! Welcome ${authData.name}.`,
            type: 'profile',
            data: authData
          };
        } else {
          return `❌ Roll number not found. Please check and try again. Valid format: 2223810-2223889`;
        }
      }
      
      // Not authenticated and not trying to authenticate
      if (lowercaseMsg.includes('my attendance') || lowercaseMsg.includes('my grades') || lowercaseMsg.includes('my subjects')) {
        return '🔐 Please authenticate first by providing your Roll Number (e.g., 2223810) to access your personal information.';
      }
    }
    
    // Personal queries - only accessible after authentication
    if (authenticatedStudentId) {
      if (lowercaseMsg.includes('my attendance') || lowercaseMsg.includes('attendance')) {
        const attendanceData = await callBackendAPI(`/student/${authenticatedStudentId}/attendance`);
        if (attendanceData) {
          return `📊 Your Attendance Record (Logged in as ${studentInfo.name}):\n\nTotal Days: ${attendanceData.totalDays}\nPresent: ${attendanceData.presentDays}\nAbsent: ${attendanceData.absentDays}\nAttendance Rate: ${attendanceData.attendanceRate}%\n\n📅 Recent Records:\n${attendanceData.lastRecords.slice(0, 5).map(r => `${r.date}: ${r.present ? '✅ Present' : '❌ Absent'}`).join('\n')}`;
        }
      }
      
      if (lowercaseMsg.includes('my') && (lowercaseMsg.includes('subject') || lowercaseMsg.includes('course') || lowercaseMsg.includes('enrolled'))) {
        const subjectsData = await callBackendAPI(`/student/${authenticatedStudentId}/subjects`);
        if (subjectsData && subjectsData.length > 0) {
          return {
            text: `📚 Your Enrolled Subjects (${subjectsData.length}) - Logged in as ${studentInfo.name}:`,
            type: 'subjectsTable',
            data: subjectsData
          };
        }
      }
      
      if (lowercaseMsg.includes('my') && (lowercaseMsg.includes('grade') || lowercaseMsg.includes('score'))) {
        const subjectsData = await callBackendAPI(`/student/${authenticatedStudentId}/subjects`);
        if (subjectsData) {
          const avgScore = subjectsData.length > 0 
            ? (subjectsData.reduce((sum, s) => sum + s.currentScore, 0) / subjectsData.length).toFixed(2)
            : 'N/A';
          return `📈 Your Academic Performance:\n\nGPA: ${studentInfo.gpa}\nAverage Score: ${avgScore}%\n\nSubject-wise Scores:\n${subjectsData.map(s => `${s.name}: ${parseFloat(s.currentScore).toFixed(2)}%`).join('\n')}`;
        }
      }
      
      if (lowercaseMsg.includes('semester') || lowercaseMsg.includes('year') || lowercaseMsg.includes('level')) {
        return `📚 You are currently in Semester ${studentInfo.semester} (Logged in as ${studentInfo.name}).\n\nYour GPA: ${studentInfo.gpa}\nYour Attendance: ${studentInfo.attendancePercentage}%\n\nYou can ask about your attendance, grades, and enrolled subjects!`;
      }
    }
    
    // General public queries
    if (lowercaseMsg.includes('subject') || lowercaseMsg.includes('course') || lowercaseMsg.includes('curriculum')) {
      const subjectsData = await callBackendAPI(`/subjects/details`);
      if (subjectsData) {
        return {
          text: `📚 Available Subjects (${subjectsData.length}):`,
          type: 'subjectsTablePublic',
          data: subjectsData
        };
      }
    }
    
    if (lowercaseMsg.includes('teacher') || lowercaseMsg.includes('instructor') || lowercaseMsg.includes('professor')) {
      const teachersData = await callBackendAPI(`/teachers`);
      if (teachersData) {
        return `👨‍🏫 Faculty Members (${teachersData.length}):\n\n${teachersData.map(t => `${t.name}\nSpecialization: ${t.specialization}\nExperience: ${t.experience}\nEmail: ${t.email}\nSubjects: ${t.subjects.join(', ')}`).join('\n\n')}`;
      }
    }
    
    if (lowercaseMsg.includes('study plan') || lowercaseMsg.includes('syllabus') || lowercaseMsg.includes('curriculum')) {
      return '📖 Which subject would you like the study plan for? (e.g., "Show me the study plan for OOP" or "Curriculum for Data Structures")';
    }
    
    return null;
  };

  const callGeminiAPI = async (userMessage) => {
    try {
      console.log('📤 Calling Gemini API with message:', userMessage);
      console.log('🔑 API Key:', geminiKey ? 'Present' : 'Missing');
      
      // Teacher-to-Subjects mapping based on curriculum
      const teacherSubjects = {
        'Dr. Rajesh Kumar': ['CS101 - Object Oriented Programming', 'CS201 - Advanced Java'],
        'Prof. Priya Sharma': ['CS102 - Data Structures', 'CS103 - Database Management'],
        'Dr. Vikram Singh': ['CS103 - Database Management', 'CS102 - Data Structures'],
        'Prof. Neha Patel': ['CS104 - Web Development', 'CS101 - Object Oriented Programming'],
        'Dr. Arjun Gupta': ['CS201 - Advanced Java', 'CS105 - Operating System'],
        'Prof. Snehal Patil': ['CS105 - Operating System', 'CS104 - Web Development']
      };

      // Build context for teacher if logged in
      let systemContext = '';
      if (authenticatedTeacher) {
        const teacherName = authenticatedTeacher.name;
        const subjects = teacherSubjects[teacherName] || [];
        const subjectsText = subjects.length > 0 ? subjects.join(', ') : 'No subjects assigned';
        const subjectsFormatted = subjects.map((s, idx) => `${idx + 1}. ${s}`).join('\n');
        
        systemContext = `You are an AI Academic Assistant helping a teacher manage their class and students.

TEACHER PROFILE:
- Name: ${teacherName}
- Email: ${authenticatedTeacher.email || 'Not specified'}
- Specialization: ${authenticatedTeacher.specialization || 'Not specified'}
- Assigned Subjects:
${subjectsFormatted || 'No subjects assigned'}

RESPONSIBILITIES:
You help with:
1. Creating relevant assignments for assigned subjects
2. Suggesting assessments tailored to course topics
3. Providing student performance analytics
4. Class scheduling and curriculum planning
5. Academic advising and student mentoring
6. Administrative queries and reporting

IMPORTANT INSTRUCTIONS:
- When asked about "my subjects" or "my classes" or "what subjects do I teach", ALWAYS respond with the exact subjects listed above in this format:
  "You are assigned to teach the following subjects:
  ${subjectsFormatted}"
- For assignment suggestions, provide content specific to the assigned subjects
- Include learning objectives and resources in assignment suggestions
- Give practical, implementable suggestions
- Always reference the specific subject codes and names when appropriate
- If asked about subjects, be direct and provide the full subject details`;
      }
      
      const requestBody = {
        contents: [
          {
            parts: [
              {
                text: systemContext ? `${systemContext}\n\nTeacher Query: ${userMessage}` : userMessage
              }
            ]
          }
        ]
      };

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody)
        }
      );

      console.log('📬 Response Status:', response.status, response.statusText);

      const responseText = await response.text();
      console.log('📨 Response Body:', responseText);

      if (!response.ok) {
        console.error('❌ Gemini API Error:', response.status, responseText);
        try {
          const errorData = JSON.parse(responseText);
          console.error('Error Details:', errorData);
        } catch (e) {
          // Response wasn't JSON
        }
        return getSimpleResponse(userMessage);
      }

      try {
        const data = JSON.parse(responseText);
        console.log('✅ Gemini Response:', data);
        
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
          const responseTextContent = data.candidates[0].content.parts[0].text;
          if (responseTextContent && responseTextContent.trim()) {
            console.log('✨ Returning API response');
            return responseTextContent;
          }
        }
      } catch (parseErr) {
        console.error('❌ Failed to parse response:', parseErr);
      }
      
      console.log('⚠️ Falling back to demo response');
      return getSimpleResponse(userMessage);
    } catch (err) {
      console.error('❌ Error calling Gemini API:', err);
      return getSimpleResponse(userMessage);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputMessage.trim()) return;

    const userMsg = {
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      // First, try to handle with database queries
      let botResponse = await handleStudentMessage(inputMessage);
      
      // If no database response, use Gemini AI
      if (!botResponse) {
        botResponse = await callGeminiAPI(inputMessage);
      }

      const botMsg = {
        type: 'bot',
        content: typeof botResponse === 'string' ? botResponse : botResponse.text || botResponse,
        timestamp: new Date().toLocaleTimeString(),
        ...(typeof botResponse === 'object' && { responseType: botResponse.type, data: botResponse.data })
      };

      setTimeout(() => {
        setMessages(prev => [...prev, botMsg]);
        setLoading(false);
      }, 300);
    } catch (err) {
      console.error('Error:', err);
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        type: 'bot',
        content: '👋 Welcome to Academic Assistant! I can help you with:\n\n📚 Subjects & Courses - View all available courses and their details\n👨‍🏫 Teachers & Instructors - Find instructor contact and expertise\n📊 Your Grades & Performance - Check your scores (provide student ID)\n✅ Attendance Records - View your attendance percentage (provide student ID)\n📖 Study Plans & Syllabus - Get detailed curriculum for any subject\n\nProvide your student ID for personalized information, or ask about any course/teacher!',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
    setInputMessage('');
  };

  return (
    <div className="chatbot-app">
      {/* Show Teacher Dashboard if teacher is authenticated */}
      {mode === 'teacherDashboard' && authenticatedTeacher && (
        <TeacherDashboard 
          teacher={authenticatedTeacher}
          onLogout={() => {
            setAuthenticatedTeacher(null);
            setMode('student');
          }}
        />
      )}

      {/* Show Teacher Login if in teacher login mode */}
      {mode === 'teacherLogin' && (
        <TeacherLogin
          onLoginSuccess={(teacher) => {
            setAuthenticatedTeacher(teacher);
            if (teacher.mode === 'chat') {
              setMode('teacherChat');
              setMessages([
                {
                  type: 'bot',
                  content: `👋 Welcome, ${teacher.name}!\n\nI'm your AI Academic Assistant. I can help you with:\n\n📊 Class Analytics - Student performance, grades, attendance patterns\n👨‍🎓 Student Insights - Individual student progress and concern areas\n📚 Subject Planning - Curriculum, assignments, practical schedules\n❓ General Questions - Ask me anything about your courses or students\n\nWhat would you like to know?`,
                  timestamp: new Date().toLocaleTimeString()
                }
              ]);
            } else {
              setMode('teacherDashboard');
            }
          }}
          onBackToStudent={() => setMode('student')}
        />
      )}

      {/* Show Student Chat if in student mode */}
      {mode === 'student' && (
        <>
      {/* Header */}
      <header className="chatbot-header">
        <div className="header-content">
          <div className="logo">
            <h1>📚 AI Learning Assistant</h1>
            <p>Student Information & Academic Support Hub</p>
          </div>
          <div className="header-actions">
            <button className="action-btn" onClick={handleNewChat} title="New Chat">
              ✨ New Chat
            </button>
            <button 
              className="action-btn teacher-btn" 
              onClick={() => setMode('teacherLogin')} 
              title="Teacher Portal"
            >
              👨‍🏫 Teacher Portal
            </button>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="chatbot-main">
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-bubble">
                  {msg.responseType === 'profile' && msg.data ? (
                    <div className="profile-card">
                      <div className="profile-header">
                        <h3 className="profile-name">👤 {msg.data.name}</h3>
                        <span className="profile-status">✅ Authenticated</span>
                      </div>
                      <div className="profile-grid">
                        <div className="profile-item" onClick={() => copyToClipboard(msg.data.studentId, 'rollno')}>
                          <span className="profile-label">Roll Number</span>
                          <div className="profile-value">{msg.data.studentId}</div>
                          {copiedId === 'rollno' && <span className="copy-success">Copied!</span>}
                          <span className="copy-hint">Click to copy</span>
                        </div>
                        <div className="profile-item">
                          <span className="profile-label">Semester</span>
                          <div className="profile-value">{msg.data.semester}</div>
                        </div>
                        <div className="profile-item">
                          <span className="profile-label">GPA</span>
                          <div className="profile-value">{msg.data.gpa}</div>
                        </div>
                        <div className="profile-item">
                          <span className="profile-label">Attendance</span>
                          <div className="profile-value">{msg.data.attendancePercentage}%</div>
                        </div>
                      </div>
                      <div className="personal-actions">
                        <button className="personal-action-btn" onClick={() => handleQuickAction('attendance')}>📊 Attendance</button>
                        <button className="personal-action-btn" onClick={() => handleQuickAction('grades')}>📈 Grades</button>
                        <button className="personal-action-btn" onClick={() => handleQuickAction('subjects')}>📚 Subjects</button>
                        <button className="personal-action-btn" onClick={() => handleQuickAction('semester')}>📅 Semester</button>
                      </div>
                    </div>
                  ) : msg.responseType === 'subjectsTable' && msg.data ? (
                    <div className="subjects-table-container">
                      <div className="table-title">{msg.content}</div>
                      <table className="subjects-table">
                        <thead>
                          <tr>
                            <th>Subject Name</th>
                            <th>Code</th>
                            <th>TA 1 Marks</th>
                            <th>Progress</th>
                            <th>Teacher</th>
                          </tr>
                        </thead>
                        <tbody>
                          {msg.data.map((subject, idx) => (
                            <tr key={idx}>
                              <td>{subject.name}</td>
                              <td>{subject.code}</td>
                              <td className="score-cell">{parseFloat(subject.currentScore).toFixed(2)}%</td>
                              <td className="progress-cell">{subject.topicProgress}</td>
                              <td>{subject.teacher || 'TBA'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : msg.responseType === 'subjectsTablePublic' && msg.data ? (
                    <div className="subjects-table-container">
                      <div className="table-title">{msg.content}</div>
                      <table className="subjects-table public">
                        <thead>
                          <tr>
                            <th>Subject Name</th>
                            <th>Code</th>
                            <th>Credits</th>
                            <th>Semester</th>
                            <th>Teacher</th>
                            <th>Topics</th>
                            <th>Hours</th>
                          </tr>
                        </thead>
                        <tbody>
                          {msg.data.map((subject, idx) => (
                            <tr key={idx}>
                              <td className="name-cell">{subject.name}</td>
                              <td>{subject.code}</td>
                              <td>{subject.credits}</td>
                              <td className="semester-cell">Sem {subject.semester}</td>
                              <td>{subject.teacher?.name || 'TBA'}</td>
                              <td>{subject.topicCount}</td>
                              <td>{subject.totalEstimatedHours}h</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : msg.type === 'bot' ? (
                    <div className="message-text">{formatMessage(msg.content)}</div>
                  ) : (
                    <p className="message-text">{msg.content}</p>
                  )}
                  <span className="message-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <form className="message-input-section" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Ask about your attendance, grades, schedule..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !inputMessage.trim()}>
            {loading ? '⏳' : '➤'}
          </button>
        </form>
      </main>

      {/* Footer */}
      <footer className="chatbot-footer">
        <p>📖 Query your attendance, grades, schedule & educational resources</p>
      </footer>
        </>
      )}

      {/* Show Teacher Chat if in teacher chat mode */}
      {mode === 'teacherChat' && authenticatedTeacher && (
        <>
      <header className="chatbot-header">
        <div className="header-content">
          <div className="logo">
            <h1>🤖 Teacher Assistant AI</h1>
            <p>Class Analytics & Student Insights</p>
            <p className="teacher-info">👨‍🏫 {authenticatedTeacher.name}</p>
          </div>
          <div className="header-actions">
            <button className="action-btn" onClick={() => {
              setMessages([
                {
                  type: 'bot',
                  content: `👋 Welcome back, ${authenticatedTeacher.name}!\n\nI'm your AI Academic Assistant. I can help you with:\n\n📊 Class Analytics - Student performance, grades, attendance patterns\n👨‍🎓 Student Insights - Individual student progress and concern areas\n📚 Subject Planning - Curriculum, assignments, practical schedules\n❓ General Questions - Ask me anything about your courses or students`,
                  timestamp: new Date().toLocaleTimeString()
                }
              ]);
              setInputMessage('');
            }} title="New Chat">
              ✨ New Chat
            </button>
            <button 
              className="action-btn" 
              onClick={() => {
                setAuthenticatedTeacher(null);
                setMode('student');
                setMessages([
                  {
                    type: 'bot',
                    content: '👋 Welcome to Academic Assistant!...',
                    timestamp: new Date().toLocaleTimeString()
                  }
                ]);
              }} 
              title="Exit Teacher Mode"
            >
              🚪 Exit
            </button>
          </div>
        </div>
      </header>

      <main className="chatbot-main">
        <div className="messages-container">
          <div className="messages-list">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-bubble">
                  {msg.type === 'bot' ? (
                    <div className="message-text">{formatMessage(msg.content)}</div>
                  ) : (
                    <p className="message-text">{msg.content}</p>
                  )}
                  <span className="message-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="message bot">
                <div className="message-bubble">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <form className="message-input-section" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Ask about students, grades, performance, schedule..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button type="submit" disabled={loading || !inputMessage.trim()}>
            {loading ? '⏳' : '➤'}
          </button>
        </form>
      </main>

      <footer className="chatbot-footer">
        <p>📊 Ask about student performance, class analytics, and curriculum planning</p>
      </footer>
        </>
      )}
    </div>
  );
};

export default SimpleChatbot;
