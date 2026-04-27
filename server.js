const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve React Frontend (static files from build)
app.use(express.static(path.join(__dirname, 'frontend-chatbot/build')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Chatbot Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.get('/api/chatbot/data', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Chatbot API is working'
  });
});

// Catch-all route: Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend-chatbot/build/index.html'));
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║  🚀 CHATBOT IS LIVE!                              ║');
  console.log(`║  Server running at http://localhost:${PORT}         ║`);
  console.log('║  Check your Replit URL above!                     ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');
  console.log('📱 API Health: http://localhost:' + PORT + '/api/health');
  console.log('🌐 Frontend: http://localhost:' + PORT);
  console.log('');
});

module.exports = app;
