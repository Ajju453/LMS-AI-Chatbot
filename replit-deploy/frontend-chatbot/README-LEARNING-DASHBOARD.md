# 🤖 AI Learning Path Chatbot

Your personal AI tutor integrated with a comprehensive learning dashboard. Master new skills faster with personalized guidance.

## ✨ Features

### 📚 AI Tutor
- **Context-Aware Responses**: The AI knows your current learning path and courses
- **Personalized Help**: Get explanations tailored to your level
- **Code Debugging**: Ask for help with programming problems
- **Study Tips**: Receive learning strategies and best practices
- **24/7 Availability**: Learn whenever you want

### 📊 Learning Dashboard
- **Progress Tracking**: Monitor your advancement in active courses
- **Learning Paths**: Explore and follow structured learning roadmaps
- **Course Management**: Track multiple courses simultaneously
- **Student Profile**: View your learning history and achievements
- **Statistics**: See detailed stats on questions asked and concepts mastered
- **Badges & Achievements**: Earn recognition for your progress

### 🎯 Smart Features
- **Chat History**: Automatic saving of your conversations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Feedback**: Instant responses from OpenAI's GPT-3.5
- **Secure Storage**: Your API key is stored locally, never shared

## 🚀 Quick Start

### Option 1: Double-Click Launcher (Easiest)
1. Navigate to the `frontend-chatbot` folder
2. Double-click **`launch.bat`** (Windows)
3. Paste your OpenAI API key when prompted
4. Start learning!

### Option 2: PowerShell
```powershell
cd "C:\Users\Z00588XV\Desktop\New folder (2)\frontend-chatbot"
.\launch.ps1
```

### Option 3: Command Line
```bash
cd frontend-chatbot
npm install  # Only needed first time
npm start
```

Then open: **http://localhost:3000**

## 🔑 Getting Your OpenAI API Key

1. Visit: https://platform.openai.com/api-keys
2. Sign up or log in
3. Click `+ Create new secret key`
4. Copy your key (starts with `sk-proj-`)
5. Paste into the app's Settings

**Free Tier**: $5 monthly credits included! 🎉

## 📖 How to Use

### Chat with Your AI Tutor
1. Click **⚙️ Setup** (first time only)
2. Add your OpenAI API key
3. Start typing your questions
4. Get instant, personalized responses

**Example Questions:**
- "Explain async/await in JavaScript"
- "Help me debug this React component"
- "What should I study next in my learning path?"
- "What are the best practices for web development?"

### View Your Learning Dashboard
1. Click **📊 Dashboard** button (top right)
2. See your:
   - Student profile & ID
   - Overall learning progress
   - Active courses with completion percentages
   - Available learning paths
   - AI tutor interaction statistics
   - Earned achievements & badges

### Manage Learning Paths
- Click on any learning path in the dashboard to switch
- Track progress across multiple paths
- Monitor your learningstreak
- Get recommendations for next courses

## 🎨 User Interface

### Header
- **📊 Dashboard** - View learning progress and paths
- **⚙️ Settings** - Configure API key
- **✨ New Chat** - Start a new conversation
- **🗑️ Clear** - Clear chat history

### Main Chat Area
- Message history with timestamps
- Typing indicator while waiting for response
- Suggestion chips for quick prompts
- Real-time message streaming

### Dashboard Modal
- **Student Profile**: ID, path, join date
- **Progress Stats**: Completed courses, in-progress, streak
- **Active Courses**: Visual progress bars
- **Learning Paths**: Switch between different learning tracks
- **AI Stats**: Questions asked, topics learned, mastered
- **Achievements**: Earned badges and recognition

## 💾 Data Storage

- **Chat History**: Saved in browser's localStorage
- **API Key**: Stored locally in `.env.local` (never shared)
- **Settings**: Preserved between sessions
- **Learning Progress**: Updated in real-time

## ⚙️ Configuration

Edit `.env.local` to customize:

```env
REACT_APP_OPENAI_API_KEY=your-api-key-here
REACT_APP_STUDENT_ID=STU001
REACT_APP_DEFAULT_PATH=General Learning
```

## 📁 File Structure

```
frontend-chatbot/
├── launch.bat                # One-click starter (Windows)
├── launch.ps1               # PowerShell launcher
├── run.bat                  # Simple runner
├── .env.local              # Your API key (auto-created)
├── package.json
├── src/
│   ├── components/
│   │   ├── SimpleChatbot.jsx      # Main component
│   │   └── SimpleChatbot.css      # Styling
│   ├── App.jsx
│   └── index.js
└── README.md
```

## 🔒 Security & Privacy

✅ **API keys stored locally** - Never uploaded to anyone  
✅ **Secure HTTPS connections** - Data encrypted in transit  
✅ **No tracking** - Your conversations stay with you  
✅ **No account required** - Just use the app  
✅ **Open source** - See exactly what the code does  

## 🎓 Learning Path Examples

### Web Development
- HTML/CSS Fundamentals
- JavaScript Basics
- React Fundamentals
- Advanced JavaScript
- Web Development Best Practices

### Mobile Development
- React Native Basics
- Mobile UI/UX
- State Management
- Native Libraries Integration

### Data Science
- Python Fundamentals
- Data Analysis
- Machine Learning Basics
- Statistics & Probability

### AI/ML Engineering
- Neural Networks
- Deep Learning
- Computer Vision
- NLP Fundamentals

## 🐛 Troubleshooting

### "Port 3000 already in use"
The app will ask to use a different port. Answer **yes** and continue.

### "API key not working"
- Verify the key starts with `sk-proj-`
- Check you copied the entire key without spaces
- Ensure you have remaining API credits
- Go to https://platform.openai.com/account/api-keys to verify

### "npm start fails"
```bash
# Clear cache and reinstall
rm -r node_modules package-lock.json
npm install
npm start
```

### "Module not found"
```bash
npm install
npm start
```

## 📊 Usage Statistics

The dashboard tracks:
- **Questions Asked**: Total interactions with AI
- **Topics Learned**: Unique concepts covered
- **Concepts Mastered**: Deep understanding areas
- **Learning Streak**: Consecutive days learning
- **Avg Response Time**: AI tutor performance

## 🌟 Tips for Better Learning

1. **Be Specific**: Ask detailed questions for better answers
2. **Practice**: Apply what you learn in real projects
3. **Consistent**: Use the daily streak feature to stay motivated
4. **Explore**: Try different learning paths
5. **Review**: Revisit concepts through chat history

## 🚀 Future Enhancements

- 📱 Mobile app version
- 🌍 Multiple language support
- 📈 Advanced analytics dashboard
- 🎁 Gamification & more badges
- 🌙 Dark mode
- 📚 Integrated learning resources
- 🤝 Peer learning features

## 📞 Support

For issues or questions:
1. Check this README
2. Review troubleshooting section
3. Visit: https://platform.openai.com/docs
4. Check OpenAI API status

## 📄 License

This project is open source and available under the MIT License.

---

**Ready to start learning?** 🎉

1. Double-click `launch.bat`
2. Add your API key
3. Start chatting with your AI tutor!

Happy learning! 📚✨
