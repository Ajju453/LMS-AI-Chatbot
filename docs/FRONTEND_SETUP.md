# AI Chatbot - Frontend Setup Guide

## Prerequisites
- Node.js 16+
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
cd frontend-chatbot
npm install
```

### 2. Configure Environment
Create `.env` file in `frontend-chatbot/` directory:
```
REACT_APP_API_URL=http://localhost:8080/api
```

### 3. Start Development Server
```bash
npm start
```

App will open at: `http://localhost:3000`

## Build for Production
```bash
npm run build
```

## Project Structure

### Components
- **Chatbot.jsx** - Main chatbot interface with message handling
- **StudentDashboard.jsx** - Student performance overview
- **HomePage.jsx** - Main entry point with login

### Services
- **api.js** - Axios API client with all endpoints

### Styles
- CSS files for each component with responsive design

## Features

### Chatbot Interface
- Real-time messaging
- Message history loading
- Intelligent intent detection
- Chat history management
- Auto-scroll to latest message

### Student Dashboard
- Student information card
- Attendance tracking
- Backlog management
- Performance metrics
- Monthly reports

### Navigation
- Tab-based navigation (Desktop)
- Mobile-friendly sidebar menu
- Responsive design

## Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject configuration (one-way operation!)
npm run eject
```

## Common Issues

### CORS Error
- Ensure backend is running on `http://localhost:8080`
- Check `allowed-origins` in backend `application.yml`

### API Connection Failed
- Verify backend is running
- Check REACT_APP_API_URL in .env
- Ensure port 8080 is accessible

### npm Install Fails
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Customization

### Change API URL
Edit `.env`:
```
REACT_APP_API_URL=http://your-api-server:8080/api
```

### Styling Colors
Edit component CSS files to customize colors (currently using #667eea)

### Add New Components
1. Create component in `src/components/`
2. Create corresponding CSS file
3. Import and use in pages

## Dependencies

### Main Libraries
- **React** - UI framework
- **React Router** - Page navigation
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Material-UI** - UI components

### Development
- **React Scripts** - React app scripts
- **Testing Library** - Testing utilities

## Performance Tips

1. Use React.memo for large lists
2. Lazy load components
3. Optimize image sizes
4. Use production build for deployment
5. Enable gzip compression on server

## Deployment

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Upload 'build' folder to Netlify
```

### Deploy to Docker
```bash
docker build -t learning-chatbot-frontend .
docker run -p 3000:3000 learning-chatbot-frontend
```
