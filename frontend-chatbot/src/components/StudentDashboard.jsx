import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import { studentAPI, attendanceAPI, reportAPI } from '../services/api';
import { FiUser, FiBook, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const StudentDashboard = ({ studentId }) => {
  const [student, setStudent] = useState(null);
  const [backlogs, setBacklogs] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentId) {
      loadStudentData();
    }
  }, [studentId]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      // Load student info
      const studentRes = await studentAPI.getStudent(studentId);
      if (studentRes.data.success) {
        setStudent(studentRes.data.data);
      }

      // Load backlogs
      const backlogsRes = await studentAPI.getBacklogs(studentId);
      if (backlogsRes.data.success) {
        setBacklogs(backlogsRes.data.data);
      }

      // Load attendance
      const attRes = await attendanceAPI.getAttendancePercentage(studentId);
      if (attRes.data.success) {
        setAttendance(attRes.data);
      }

      // Load latest report
      const reportRes = await reportAPI.generateMonthlyReport(studentId);
      if (reportRes.data.success) {
        setReport(reportRes.data.data);
      }
    } catch (err) {
      setError('Failed to load student data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Student Dashboard</h1>
        <button onClick={loadStudentData} className="refresh-btn">
          Refresh
        </button>
      </div>

      {error && <div className="error">{error}</div>}

      {student && (
        <div className="dashboard-grid">
          {/* Student Info Card */}
          <div className="card student-info">
            <div className="card-icon">
              <FiUser size={32} />
            </div>
            <h3>{student.name}</h3>
            <p className="student-id">{student.studentId}</p>
            <div className="info-row">
              <span>Semester:</span>
              <strong>{student.semester}</strong>
            </div>
            <div className="info-row">
              <span>GPA:</span>
              <strong>{student.gpa?.toFixed(2) || '0.00'}</strong>
            </div>
          </div>

          {/* Attendance Card */}
          {attendance && (
            <div className={`card attendance-card ${
              attendance.status === 'GOOD' ? 'good' : 'warning'
            }`}>
              <div className="card-icon">
                <FiCheckCircle size={32} />
              </div>
              <h3>Attendance</h3>
              <div className="percentage">
                {attendance.percentage.toFixed(1)}%
              </div>
              <p className={`status ${attendance.status.toLowerCase()}`}>
                {attendance.status === 'GOOD' ? '✓ Good' : '⚠ Needs Improvement'}
              </p>
            </div>
          )}

          {/* Backlogs Card */}
          <div className={`card backlogs-card ${
            backlogs.length > 0 ? 'has-backlogs' : 'no-backlogs'
          }`}>
            <div className="card-icon">
              <FiAlertCircle size={32} />
            </div>
            <h3>Backlogs</h3>
            <div className="count">
              {backlogs.length}
            </div>
            <p>
              {backlogs.length === 0
                ? 'No backlogs - Great job!'
                : `${backlogs.length} subject(s) need attention`}
            </p>
          </div>

          {/* Report Card */}
          {report && (
            <div className="card report-card">
              <div className="card-icon">
                <FiBook size={32} />
              </div>
              <h3>Monthly Performance</h3>
              <div className="performance-level">
                {report.overallPerformance}
              </div>
              <p className="gpa">
                GPA: {report.averageGpa?.toFixed(2) || '0.00'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Backlogs List */}
      {backlogs.length > 0 && (
        <div className="card full-width backlogs-list">
          <h3>Subjects Needing Attention</h3>
          <table className="subjects-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Current Score</th>
                <th>Progress</th>
                <th>Backlog Count</th>
              </tr>
            </thead>
            <tbody>
              {backlogs.map((backlog) => (
                <tr key={backlog.id}>
                  <td className="subject-name">
                    {backlog.subject.name}
                  </td>
                  <td>{backlog.currentScore?.toFixed(2) || '0.00'}</td>
                  <td>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${backlog.topicProgress}%` }}
                      />
                    </div>
                    <span className="progress-text">
                      {backlog.topicProgress}%
                    </span>
                  </td>
                  <td>{backlog.backlogCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
