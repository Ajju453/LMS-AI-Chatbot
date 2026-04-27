import React, { useState, useEffect } from 'react';
import './TeacherDashboard.css';

const TeacherDashboard = ({ onLogout, teacher }) => {
  const [teacherData, setTeacherData] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [activeTab, setActiveTab] = useState('students'); // students, backlog, subjects, study-plan
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacherData();
  }, []);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      // Get all students from the teacher API
      const response = await fetch('http://localhost:8080/api/teacher/students');
      const data = await response.json();
      if (data.success && data.students) {
        setStudents(data.students);
      } else {
        console.error('Failed to load students:', data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getBacklogReports = () => {
    return students.map(student => {
      const backlogSubjects = (student.subjects || []).filter(s => parseFloat(s.currentScore) < 40);
      return {
        rollNumber: student.rollNumber,
        name: student.name,
        backlogCount: backlogSubjects.length,
        backlogSubjects: backlogSubjects.map(s => `${s.name} (${parseFloat(s.currentScore).toFixed(2)}%)`),
        totalBacklogMarks: backlogSubjects.reduce((sum, s) => sum + parseFloat(s.currentScore), 0)
      };
    });
  };

  const getStudentSummary = () => {
    return students.map(student => ({
      rollNumber: student.rollNumber,
      name: student.name,
      totalSubjects: (student.subjects || []).length,
      avgScore: student.subjects ? 
        (student.subjects.reduce((sum, s) => sum + parseFloat(s.currentScore), 0) / student.subjects.length).toFixed(2) :
        0,
      attendance: ((student.attendance || 0) / 120 * 100).toFixed(1),
      subjects: (student.subjects || []).map(s => s.code).join(', ')
    }));
  };

  const getSemesterPlan = () => {
    // Teacher-to-subject mapping with multiple subjects per teacher
    const teacherCurriculum = {
      'Dr. Rajesh Kumar': [
        {
          code: 'CS101',
          name: 'Object Oriented Programming',
          credits: 4,
          schedule: '9:00-10:30 AM, MWF',
          midterm: 'March 15, 2026',
          assignments: 5,
          practicals: 8,
          topics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation']
        },
        {
          code: 'CS201',
          name: 'Advanced Java',
          credits: 4,
          schedule: '2:00-3:30 PM, TTh',
          midterm: 'March 22, 2026',
          assignments: 6,
          practicals: 10,
          topics: ['Multithreading', 'Collections', 'Lambda Functions', 'Stream API']
        }
      ],
      'Prof. Priya Sharma': [
        {
          code: 'CS102',
          name: 'Data Structures',
          credits: 4,
          schedule: '10:00-11:30 AM, TTh',
          midterm: 'March 17, 2026',
          assignments: 5,
          practicals: 7,
          topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting']
        },
        {
          code: 'CS103',
          name: 'Database Management',
          credits: 4,
          schedule: '2:00-3:30 PM, MWF',
          midterm: 'March 18, 2026',
          assignments: 4,
          practicals: 6,
          topics: ['SQL', 'Normalization', 'Transactions', 'Indexing']
        }
      ],
      'Dr. Vikram Singh': [
        {
          code: 'CS103',
          name: 'Database Management',
          credits: 4,
          schedule: '2:00-3:30 PM, MWF',
          midterm: 'March 18, 2026',
          assignments: 4,
          practicals: 6,
          topics: ['SQL', 'Normalization', 'Transactions', 'Indexing']
        },
        {
          code: 'CS102',
          name: 'Data Structures',
          credits: 4,
          schedule: '10:00-11:30 AM, TTh',
          midterm: 'March 17, 2026',
          assignments: 5,
          practicals: 7,
          topics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Sorting']
        }
      ],
      'Prof. Neha Patel': [
        {
          code: 'CS104',
          name: 'Web Development',
          credits: 4,
          schedule: '9:00-10:30 AM, MWF',
          midterm: 'March 15, 2026',
          assignments: 5,
          practicals: 8,
          topics: ['HTML/CSS', 'JavaScript', 'React', 'Backend Integration']
        },
        {
          code: 'CS101',
          name: 'Object Oriented Programming',
          credits: 4,
          schedule: '9:00-10:30 AM, MWF',
          midterm: 'March 15, 2026',
          assignments: 5,
          practicals: 8,
          topics: ['Classes & Objects', 'Inheritance', 'Polymorphism', 'Encapsulation']
        }
      ],
      'Dr. Arjun Gupta': [
        {
          code: 'CS201',
          name: 'Advanced Java',
          credits: 4,
          schedule: '2:00-3:30 PM, TTh',
          midterm: 'March 22, 2026',
          assignments: 6,
          practicals: 10,
          topics: ['Multithreading', 'Collections', 'Lambda Functions', 'Stream API']
        },
        {
          code: 'CS105',
          name: 'Operating System',
          credits: 4,
          schedule: '11:00-12:30 PM, MWF',
          midterm: 'March 20, 2026',
          assignments: 4,
          practicals: 6,
          topics: ['Process Management', 'Memory Management', 'File Systems', 'Synchronization']
        }
      ],
      'Prof. Snehal Patil': [
        {
          code: 'CS105',
          name: 'Operating System',
          credits: 4,
          schedule: '11:00-12:30 PM, MWF',
          midterm: 'March 20, 2026',
          assignments: 4,
          practicals: 6,
          topics: ['Process Management', 'Memory Management', 'File Systems', 'Synchronization']
        },
        {
          code: 'CS104',
          name: 'Web Development',
          credits: 4,
          schedule: '9:00-10:30 AM, MWF',
          midterm: 'March 15, 2026',
          assignments: 5,
          practicals: 8,
          topics: ['HTML/CSS', 'JavaScript', 'React', 'Backend Integration']
        }
      ]
    };

    // Get current teacher's curriculum
    const teacherName = teacher?.name || 'Dr. Rajesh Kumar';
    const subjectPlanArray = teacherCurriculum[teacherName] || teacherCurriculum['Dr. Rajesh Kumar'];

    return {
      semester: 'Semester 2 (Spring 2026)',
      startDate: 'January 15, 2026',
      endDate: 'May 30, 2026',
      subjects: subjectPlanArray,
      exams: {
        midterm: 'March 15-25, 2026',
        endterm: 'May 10-20, 2026'
      }
    };
  };

  if (loading) {
    return <div className="teacher-loading">Loading teacher dashboard...</div>;
  }

  const backlogReports = getBacklogReports();
  const studentSummary = getStudentSummary();
  const semesterPlan = getSemesterPlan();

  return (
    <div className="teacher-dashboard">
      <div className="teacher-header">
        <div className="teacher-title">
          <h2>👨‍🏫 Teacher Dashboard</h2>
          <p>Total Students: {students.length} | Active Subjects: {new Set(students.flatMap(s => s.subjects || [])).size}</p>
        </div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="teacher-tabs">
        <button 
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          📊 All Students ({students.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'backlog' ? 'active' : ''}`}
          onClick={() => setActiveTab('backlog')}
        >
          ⚠️ Backlog Reports ({backlogReports.filter(b => b.backlogCount > 0).length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'subjects' ? 'active' : ''}`}
          onClick={() => setActiveTab('subjects')}
        >
          📚 Subject Assignment
        </button>
        <button 
          className={`tab-btn ${activeTab === 'study-plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('study-plan')}
        >
          📅 Semester Plan
        </button>
      </div>

      <div className="teacher-content">
        {/* All Students Tab */}
        {activeTab === 'students' && (
          <div className="students-section">
            <h3>All Students - Academic Summary</h3>
            <div className="students-table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Roll No.</th>
                    <th>Name</th>
                    <th>Subjects</th>
                    <th>Avg Score</th>
                    <th>Attendance</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {studentSummary.map(student => (
                    <tr key={student.rollNumber}>
                      <td><strong>{student.rollNumber}</strong></td>
                      <td>{student.name}</td>
                      <td>{student.totalSubjects}</td>
                      <td>
                        <span className={student.avgScore >= 40 ? 'score-good' : 'score-bad'}>
                          {student.avgScore}%
                        </span>
                      </td>
                      <td>
                        <span className={student.attendance >= 75 ? 'attendance-good' : 'attendance-warning'}>
                          {student.attendance}%
                        </span>
                      </td>
                      <td>
                        <button 
                          className="view-btn"
                          onClick={() => setSelectedStudent(student)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedStudent && (
              <div className="student-detail-modal">
                <div className="modal-content">
                  <button className="close-btn" onClick={() => setSelectedStudent(null)}>✕</button>
                  <h4>Student Details: {selectedStudent.name}</h4>
                  <div className="student-info">
                    <p><strong>Roll Number:</strong> {selectedStudent.rollNumber}</p>
                    <p><strong>Total Subjects:</strong> {selectedStudent.totalSubjects}</p>
                    <p><strong>Average Score:</strong> {selectedStudent.avgScore}%</p>
                    <p><strong>Attendance:</strong> {selectedStudent.attendance}%</p>
                    <p><strong>Enrolled Subjects:</strong> {selectedStudent.subjects}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Backlog Reports Tab */}
        {activeTab === 'backlog' && (
          <div className="backlog-section">
            <h3>⚠️ Backlog Reports</h3>
            <div className="backlog-summary">
              <div className="backlog-stat">
                <span className="stat-label">Total Students with Backlog:</span>
                <span className="stat-value">{backlogReports.filter(b => b.backlogCount > 0).length}</span>
              </div>
              <div className="backlog-stat">
                <span className="stat-label">Total Backlog Count:</span>
                <span className="stat-value">{backlogReports.reduce((sum, b) => sum + b.backlogCount, 0)}</span>
              </div>
            </div>
            <div className="backlog-list">
              {backlogReports.filter(b => b.backlogCount > 0).map(report => (
                <div key={report.rollNumber} className="backlog-card">
                  <div className="backlog-header">
                    <h4>{report.name} ({report.rollNumber})</h4>
                    <span className="backlog-badge">{report.backlogCount} Subjects</span>
                  </div>
                  <div className="backlog-details">
                    <p><strong>Backlog Subjects:</strong></p>
                    <ul>
                      {report.backlogSubjects.map((subject, idx) => (
                        <li key={idx}>• {subject}</li>
                      ))}
                    </ul>
                    <p className="backlog-avg">Avg Backlog Score: <strong>{(report.totalBacklogMarks / report.backlogCount).toFixed(2)}%</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subject Assignment Tab */}
        {activeTab === 'subjects' && (
          <div className="subjects-section">
            <h3>📚 Your Assigned Subjects</h3>
            <div className="assigned-subjects-list">
              {semesterPlan.subjects && semesterPlan.subjects.length > 0 ? (
                semesterPlan.subjects.map((subject, idx) => (
                  <div key={idx} className="subject-card">
                    <div className="subject-header">
                      <h4>{subject.code} - {subject.name}</h4>
                      <span className="subject-credits">{subject.credits} Credits</span>
                    </div>
                    <div className="subject-details">
                      <p><strong>Schedule:</strong> {subject.schedule}</p>
                      <p><strong>Midterm Exam:</strong> {subject.midterm}</p>
                      <p><strong>Assignments:</strong> {subject.assignments}</p>
                      <p><strong>Practicals:</strong> {subject.practicals}</p>
                      <p><strong>Topics:</strong> {subject.topics.join(', ')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-data">No subjects assigned</p>
              )}
            </div>

            <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #ddd' }} />

            <h3>Student Distribution in Subjects</h3>
            <div className="subject-stats">
              <div className="stat-card">
                <h4>Total Students</h4>
                <p className="stat-number">{students.length}</p>
              </div>
              <div className="stat-card">
                <h4>Total Subject Registrations</h4>
                <p className="stat-number">{students.reduce((sum, s) => sum + (s.subjects ? s.subjects.length : 0), 0)}</p>
              </div>
              <div className="stat-card">
                <h4>Average Subjects per Student</h4>
                <p className="stat-number">
                  {(students.reduce((sum, s) => sum + (s.subjects ? s.subjects.length : 0), 0) / students.length).toFixed(1)}
                </p>
              </div>
            </div>
            <div className="subject-breakdown">
              <h4>Subject Enrollment Stats</h4>
              <table className="subject-table">
                <thead>
                  <tr>
                    <th>Subject Code</th>
                    <th>Subject Name</th>
                    <th>Enrolled Students</th>
                    <th>Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Step 1: Extract all unique subjects by code
                    const uniqueSubjectMap = {};
                    students.forEach(student => {
                      (student.subjects || []).forEach(subject => {
                        if (!uniqueSubjectMap[subject.code]) {
                          uniqueSubjectMap[subject.code] = {
                            code: subject.code,
                            name: subject.name
                          };
                        }
                      });
                    });

                    // Step 2: Convert map to array and calculate stats for each
                    const subjectsArray = Object.values(uniqueSubjectMap).map(subject => {
                      // Count students enrolled in this subject
                      const enrolledCount = students.filter(s => 
                        (s.subjects || []).some(sub => sub.code === subject.code)
                      ).length;

                      // Calculate average score for this subject
                      const subjectScores = students
                        .flatMap(s => (s.subjects || []).filter(sub => sub.code === subject.code))
                        .map(sub => parseFloat(sub.currentScore));
                      
                      const avgScore = subjectScores.length > 0 
                        ? subjectScores.reduce((sum, score) => sum + score, 0) / subjectScores.length
                        : 0;

                      return (
                        <tr key={subject.code}>
                          <td><strong>{subject.code}</strong></td>
                          <td>{subject.name}</td>
                          <td>{enrolledCount}</td>
                          <td>
                            <span className={avgScore >= 40 ? 'score-good' : 'score-bad'}>
                              {avgScore.toFixed(2)}%
                            </span>
                          </td>
                        </tr>
                      );
                    });

                    return subjectsArray.length > 0 ? subjectsArray : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>No students enrolled yet</td>
                      </tr>
                    );
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Semester Plan Tab */}
        {activeTab === 'study-plan' && (
          <div className="study-plan-section">
            <h3>📅 {semesterPlan.semester}</h3>
            <div className="semester-timeline">
              <div className="timeline-item">
                <span className="timeline-label">Start Date:</span>
                <span className="timeline-value">{semesterPlan.startDate}</span>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">End Date:</span>
                <span className="timeline-value">{semesterPlan.endDate}</span>
              </div>
            </div>

            <h4>Scheduled Subjects</h4>
            <div className="subjects-list">
              {semesterPlan.subjects.map(subject => (
                <div key={subject.code} className="subject-plan-card">
                  <div className="subject-header">
                    <h5>{subject.name} ({subject.code})</h5>
                    <span className="credits-badge">{subject.credits} Credits</span>
                  </div>
                  <div className="subject-schedule">
                    <p><strong>Schedule:</strong> {subject.schedule}</p>
                    <p><strong>Midterm Exam:</strong> {subject.midterm}</p>
                    <p><strong>Assignments:</strong> {subject.assignments} | <strong>Practicals:</strong> {subject.practicals}</p>
                  </div>
                </div>
              ))}
            </div>

            <h4>Exam Schedule</h4>
            <div className="exam-schedule">
              <div className="exam-item">
                <span className="exam-label">Midterm Exams:</span>
                <span className="exam-dates">{semesterPlan.exams.midterm}</span>
              </div>
              <div className="exam-item">
                <span className="exam-label">End-Term Exams:</span>
                <span className="exam-dates">{semesterPlan.exams.endterm}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;
