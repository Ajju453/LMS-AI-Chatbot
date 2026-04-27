import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chatbot API
export const chatbotAPI = {
  sendMessage: (studentId, message) =>
    apiClient.post('/chatbot/chat', { message }, { params: { studentId } }),
  
  getChatHistory: (studentId) =>
    apiClient.get(`/chatbot/history/${studentId}`),
  
  clearChatHistory: (studentId) =>
    apiClient.delete(`/chatbot/history/${studentId}`),
  
  healthCheck: () =>
    apiClient.get('/chatbot/health'),
};

// Student API
export const studentAPI = {
  getStudent: (studentId) =>
    apiClient.get(`/students/${studentId}`),
  
  getStudentByStudentId: (studentId) =>
    apiClient.get(`/students/studentId/${studentId}`),
  
  createStudent: (studentData) =>
    apiClient.post('/students', studentData),
  
  updateStudent: (studentId, studentData) =>
    apiClient.put(`/students/${studentId}`, studentData),
  
  getBacklogs: (studentId) =>
    apiClient.get(`/students/${studentId}/backlogs`),
};

// Attendance API
export const attendanceAPI = {
  getAttendance: (studentId) =>
    apiClient.get(`/attendance/student/${studentId}`),
  
  getMonthlyAttendance: (studentId, year, month) =>
    apiClient.get(`/attendance/student/${studentId}/month/${year}/${month}`),
  
  getAttendancePercentage: (studentId) =>
    apiClient.get(`/attendance/student/${studentId}/percentage`),
  
  recordAttendance: (attendanceData) =>
    apiClient.post('/attendance', attendanceData),
};

// Report API
export const reportAPI = {
  generateMonthlyReport: (studentId) =>
    apiClient.post(`/reports/generate/${studentId}`),
  
  getStudentReports: (studentId) =>
    apiClient.get(`/reports/${studentId}`),
  
  getMonthlyReport: (studentId, year, month) =>
    apiClient.get(`/reports/${studentId}/month/${year}/${month}`),
};

// Subject API
export const subjectAPI = {
  getSubject: (subjectId) =>
    apiClient.get(`/subjects/${subjectId}`),
  
  getSubjectBySemester: (semester) =>
    apiClient.get(`/subjects/semester/${semester}`),
  
  getTopics: (subjectId) =>
    apiClient.get(`/subjects/${subjectId}/topics`),
  
  getCurriculumPlan: (subjectId) =>
    apiClient.get(`/subjects/${subjectId}/curriculum-plan`),
  
  createSubject: (subjectData) =>
    apiClient.post('/subjects', subjectData),
};

export default apiClient;
