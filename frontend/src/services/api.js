import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Git Config APIs
export const gitConfigAPI = {
  saveConfig: (userId, config) => 
    api.post(`/git-config/save?userId=${userId}`, config),
  getConfig: (userId) => 
    api.get(`/git-config/${userId}`),
  getConfigContent: (userId) => 
    api.get(`/git-config/${userId}/content`),
  deleteConfig: (userId) => 
    api.delete(`/git-config/${userId}`),
};

// SSH Keys APIs
export const sshKeyAPI = {
  generateKey: (userId, keyData) => 
    api.post(`/ssh-keys/generate?userId=${userId}`, keyData),
  getUserKeys: (userId) => 
    api.get(`/ssh-keys/${userId}`),
  getKey: (userId, email) => 
    api.get(`/ssh-keys/${userId}/${email}`),
  activateKey: (keyId) => 
    api.put(`/ssh-keys/${keyId}/activate`),
  deactivateKey: (keyId) => 
    api.put(`/ssh-keys/${keyId}/deactivate`),
  deleteKey: (keyId) => 
    api.delete(`/ssh-keys/${keyId}`),
};

// Tasks APIs
export const taskAPI = {
  createTask: (userId, task) => 
    api.post(`/tasks?userId=${userId}`, task),
  getUserTasks: (userId) => 
    api.get(`/tasks/${userId}`),
  getActiveTasks: (userId) => 
    api.get(`/tasks/${userId}/active`),
  getCompletedTasks: (userId) => 
    api.get(`/tasks/${userId}/completed`),
  updateTask: (taskId, updates) => 
    api.put(`/tasks/${taskId}`, updates),
  toggleTask: (taskId) => 
    api.put(`/tasks/${taskId}/toggle`),
  deleteTask: (taskId) => 
    api.delete(`/tasks/${taskId}`),
  deleteUserTasks: (userId) => 
    api.delete(`/tasks/${userId}/all`),
};

// Health Check
export const healthAPI = {
  check: () => 
    api.get('/health'),
};

export default api;
